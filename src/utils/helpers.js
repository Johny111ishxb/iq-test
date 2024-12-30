export const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  export const calculateIQScore = (correct, total, timeRatio) => {
    const baseScore = (correct / total) * 100;
    const timeBonus = Math.max(0, (1 - timeRatio) * 20);
    const finalScore = Math.round(baseScore + timeBonus);
    return Math.min(160, Math.max(70, finalScore));
  };