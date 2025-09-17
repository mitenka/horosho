import { useState } from "react";
import {
  getReadArticles,
  markArticleAsRead,
  markArticleAsUnread,
} from "../services/dataService";
export const useReadingProgressContext = () => {
  const [readArticles, setReadArticles] = useState({});
  const [blockProgress, setBlockProgress] = useState({});

  const loadReadingProgress = async () => {
    try {
      const readArticlesData = await getReadArticles();
      setReadArticles(readArticlesData);
      return readArticlesData;
    } catch (err) {
      console.error("Error loading reading progress:", err);
      throw err;
    }
  };

  const calculateSingleBlockProgress = (
    blockId,
    theoryData,
    readArticlesData
  ) => {
    const block = theoryData.blocks.find((b) => b.id === blockId);
    if (!block || !block.articles || block.articles.length === 0) {
      return 0;
    }

    const totalArticles = block.articles.length;
    const currentArticleIds = block.articles.map((article) => article.id);

    const validReadArticles = (readArticlesData[blockId] || []).filter(
      (articleId) => currentArticleIds.includes(articleId)
    );

    const readCount = validReadArticles.length;
    return readCount / totalArticles;
  };

  const updateBlockProgress = async (theoryData, readArticlesData) => {
    try {
      const progress = {};

      if (theoryData && theoryData.blocks) {
        for (const block of theoryData.blocks) {
          progress[block.id] = calculateSingleBlockProgress(
            block.id,
            theoryData,
            readArticlesData
          );
        }
      }

      setBlockProgress(progress);
      return progress;
    } catch (err) {
      console.error("Error updating block progress:", err);
      throw err;
    }
  };

  const markAsRead = async (blockId, articleId, theory) => {
    try {
      const success = await markArticleAsRead(blockId, articleId);
      if (success) {
        const updatedReadArticles = { ...readArticles };
        if (!updatedReadArticles[blockId]) {
          updatedReadArticles[blockId] = [];
        }
        if (!updatedReadArticles[blockId].includes(articleId)) {
          updatedReadArticles[blockId].push(articleId);
          setReadArticles(updatedReadArticles);

          const updatedProgress = { ...blockProgress };
          updatedProgress[blockId] = calculateSingleBlockProgress(
            blockId,
            theory,
            updatedReadArticles
          );
          setBlockProgress(updatedProgress);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error marking article as read:", err);
      return false;
    }
  };

  const markAsUnread = async (blockId, articleId, theory) => {
    try {
      const success = await markArticleAsUnread(blockId, articleId);
      if (success) {
        const updatedReadArticles = { ...readArticles };
        if (updatedReadArticles[blockId]) {
          const index = updatedReadArticles[blockId].indexOf(articleId);
          if (index !== -1) {
            updatedReadArticles[blockId].splice(index, 1);
            setReadArticles(updatedReadArticles);

            const updatedProgress = { ...blockProgress };
            updatedProgress[blockId] = calculateSingleBlockProgress(
              blockId,
              theory,
              updatedReadArticles
            );
            setBlockProgress(updatedProgress);
          }
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error marking article as unread:", err);
      return false;
    }
  };
  const checkIfRead = (blockId, articleId) => {
    return readArticles[blockId]?.includes(articleId) || false;
  };

  const getBlockProgress = (blockId) => {
    return blockProgress[blockId] || 0;
  };

  return {
    readArticles,
    blockProgress,
    loadReadingProgress,
    calculateSingleBlockProgress,
    updateBlockProgress,
    markAsRead,
    markAsUnread,
    checkIfRead,
    getBlockProgress,
  };
};
