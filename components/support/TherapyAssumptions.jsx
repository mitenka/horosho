import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const assumptions = [
  {
    title: "Все люди стараются настолько хорошо, насколько могут",
    text: "Все люди в каждый момент времени действуют настолько хорошо, насколько это возможно для них."
  },
  {
    title: "Все люди хотят чувствовать себя лучше",
    text: "Общая для всех людей характеристика — то, что люди хотят улучшать свои жизни и быть счастливыми."
  },
  {
    title: "Люди могут добиться большего, если будут стараться сильнее и работать над своей мотивацией",
    text: "Тот факт, что люди стараются максимально хорошо и хотят быть ещё лучше, не значит, что этого достаточно, чтобы решить проблему."
  },
  {
    title: "Может быть, люди не являются причиной всех своих проблем, но тем не менее решать эти проблемы приходится именно им",
    text: "Людям необходимо менять свои собственные поведенческие реакции и изменять своё окружение, чтобы их жизни менялись."
  },
  {
    title: "Новое поведение должно быть выучено в подходящем контексте",
    text: "Новые поведенческие навыки следует практиковать в ситуациях, в которых навыки действительно требуются, а не только на тренинге."
  },
  {
    title: "Все действия, мысли и эмоции имеют причины",
    text: "Всегда существует ряд причин для наших действий, мыслей и эмоций, даже если мы не знаем этих причин."
  },
  {
    title: "Выявление и изменение причин поведения эффективнее, чем обвинение и осуждение",
    text: "Обвинять и осуждать может быть легче, но если мы хотим добиться реальных изменений, нам необходимо изменить цепи событий, приводящих к нежелательным последствиям."
  }
];

const { width } = Dimensions.get('window');
const cardGap = 16;
const cardWidth = width - 40; // Full width minus section margins

// White border color to match the breathing square
const cardBorderColor = '#ffffff';

// Single subtle divider color for consistency
const dividerColor = 'rgba(255, 255, 255, 0.28)';

export default function TherapyAssumptions() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (cardWidth + cardGap));
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        snapToInterval={cardWidth + cardGap}
        decelerationRate="fast"
        snapToAlignment="start"
      >
        {assumptions.map((assumption, index) => (
          <View key={index} style={[
            styles.card,
            { 
              marginRight: index === assumptions.length - 1 ? 0 : cardGap,
              borderColor: cardBorderColor
            }
          ]}>
            <Text style={styles.cardTitle}>{assumption.title}</Text>
            <View style={styles.divider} />
            <Text style={styles.cardText}>{assumption.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {assumptions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              {
                opacity: index === currentIndex ? 1 : 0.3,
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 24,
  },
  scrollView: {
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 180,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 26,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  divider: {
    width: 48,
    height: StyleSheet.hairlineWidth,
    backgroundColor: dividerColor,
    opacity: 0.9,
    marginBottom: 14,
  },
  cardText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    fontWeight: '400',
    fontStyle: 'italic',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 4,
  },
});
