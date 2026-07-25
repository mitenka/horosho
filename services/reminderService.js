import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { formatDateToString, getTodayDateString } from "../utils/dateUtils";
import { getDiaryCompletionStatus } from "./diaryService";
import { getSettings } from "./settingsService";

// How the notification is presented when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const REMINDER_ID_PREFIX = "diary-reminder-";
const ANDROID_CHANNEL_ID = "diary-reminders";
const DEFAULT_REMINDER_TIME = "20:00";
// iOS caps pending local notifications at 64; if the app is not opened
// for this many days, reminders silently stop until the next launch
const SCHEDULE_HORIZON_DAYS = 14;

const NOTIFICATION_TITLE = "Как прошёл день?";
const NOTIFICATION_BODY =
  "Загляните в дневниковую карточку — отметить день займёт пару минут.";

/**
 * Check whether notification permissions are currently granted
 * @returns {Promise<boolean>} Whether permissions are granted
 */
export const hasNotificationPermissions = async () => {
  try {
    const { granted } = await Notifications.getPermissionsAsync();
    return granted;
  } catch (error) {
    console.error("Error checking notification permissions:", error);
    return false;
  }
};

/**
 * Ensure notification permissions, requesting them if possible.
 * Call only from an explicit user action (e.g. enabling the toggle).
 * @returns {Promise<boolean>} Whether permissions are granted
 */
export const ensureNotificationPermissions = async () => {
  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return true;
    }
    if (!current.canAskAgain) {
      return false;
    }
    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

/**
 * Cancel all scheduled diary reminders
 * @returns {Promise<void>}
 */
export const cancelDiaryReminders = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      scheduled
        .filter((notification) =>
          notification.identifier.startsWith(REMINDER_ID_PREFIX)
        )
        .map((notification) =>
          Notifications.cancelScheduledNotificationAsync(
            notification.identifier
          )
        )
    );
  } catch (error) {
    console.error("Error cancelling diary reminders:", error);
  }
};

const parseReminderTime = (timeString) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeString || "");
  if (!match) {
    return parseReminderTime(DEFAULT_REMINDER_TIME);
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return parseReminderTime(DEFAULT_REMINDER_TIME);
  }
  return { hours, minutes };
};

/**
 * Re-create the pending diary reminders from current settings and diary state.
 * Idempotent: cancels previously scheduled reminders, then schedules one
 * notification per day for the next SCHEDULE_HORIZON_DAYS days, skipping
 * today if its time has passed or the diary is already marked as completed.
 * @returns {Promise<void>}
 */
export const rescheduleDiaryReminders = async () => {
  try {
    await cancelDiaryReminders();

    const settings = await getSettings();
    if (!settings.diaryReminderEnabled) {
      return;
    }

    if (!(await hasNotificationPermissions())) {
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: "Напоминания о дневнике",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { hours, minutes } = parseReminderTime(settings.diaryReminderTime);
    const now = new Date();
    const todayCompleted = await getDiaryCompletionStatus(
      getTodayDateString()
    );

    for (let dayOffset = 0; dayOffset < SCHEDULE_HORIZON_DAYS; dayOffset++) {
      const date = new Date();
      date.setDate(date.getDate() + dayOffset);
      date.setHours(hours, minutes, 0, 0);

      if (dayOffset === 0 && (date <= now || todayCompleted)) {
        continue;
      }

      await Notifications.scheduleNotificationAsync({
        identifier: `${REMINDER_ID_PREFIX}${formatDateToString(date)}`,
        content: {
          title: NOTIFICATION_TITLE,
          body: NOTIFICATION_BODY,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: ANDROID_CHANNEL_ID,
        },
      });
    }
  } catch (error) {
    console.error("Error rescheduling diary reminders:", error);
  }
};
