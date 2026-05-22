// ===== Lightweight Charts ユーティリティ =====

// 日足データから週足データを計算
function dailyToWeekly(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];

  const weeklyMap = {};
  for (const candle of dailyData) {
    const date = new Date(candle.time * 1000);
    const year = date.getFullYear();
    const week = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
    const weekKey = `${year}-W${String(week).padStart(2, '0')}`;

    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = {
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      };
    } else {
      weeklyMap[weekKey].high = Math.max(weeklyMap[weekKey].high, candle.high);
      weeklyMap[weekKey].low = Math.min(weeklyMap[weekKey].low, candle.low);
      weeklyMap[weekKey].close = candle.close;
      weeklyMap[weekKey].time = candle.time;
    }
  }
  return Object.values(weeklyMap);
}

// 日足データから月足データを計算
function dailyToMonthly(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];

  const monthlyMap = {};
  for (const candle of dailyData) {
    const date = new Date(candle.time * 1000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = {
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      };
    } else {
      monthlyMap[monthKey].high = Math.max(monthlyMap[monthKey].high, candle.high);
      monthlyMap[monthKey].low = Math.min(monthlyMap[monthKey].low, candle.low);
      monthlyMap[monthKey].close = candle.close;
      monthlyMap[monthKey].time = candle.time;
    }
  }
  return Object.values(monthlyMap);
}

// 日足データから年足データを計算
function dailyToYearly(dailyData) {
  if (!dailyData || dailyData.length === 0) return [];

  const yearlyMap = {};
  for (const candle of dailyData) {
    const year = new Date(candle.time * 1000).getFullYear();

    if (!yearlyMap[year]) {
      yearlyMap[year] = {
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close
      };
    } else {
      yearlyMap[year].high = Math.max(yearlyMap[year].high, candle.high);
      yearlyMap[year].low = Math.min(yearlyMap[year].low, candle.low);
      yearlyMap[year].close = candle.close;
      yearlyMap[year].time = candle.time;
    }
  }
  return Object.values(yearlyMap);
}

// チャート初期化
function initCandleChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container || !window.LightweightCharts) return null;

  const chart = LightweightCharts.createChart(container, {
    layout: {
      textColor: '#94a3b8',
      background: { color: 'transparent' }
    },
    width: container.offsetWidth || 800,
    height: 320,
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      barSpacing: 10,
      fixLeftEdge: true,
      fixRightEdge: false
    },
    grid: {
      hStyle: 0,
      vLines: { color: '#2a2d3e' },
      hLines: { color: '#2a2d3e' }
    },
    localization: {
      dateFormat: 'yyyy-MM-dd'
    }
  });

  const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#22c55e',
    downColor: '#ef4444',
    borderUpColor: '#22c55e',
    borderDownColor: '#ef4444',
    wickUpColor: '#22c55e',
    wickDownColor: '#ef4444',
    scaleMargins: { top: 0.15, bottom: 0.15 }
  });

  chart.timeScale().fitContent();

  window.addEventListener('resize', () => {
    if (chart && container) {
      chart.applyOptions({ width: container.offsetWidth });
    }
  });

  return { chart, candlestickSeries };
}

// チャート更新
function renderCandleChart(candlestickSeries, chart, ohlcData) {
  if (!candlestickSeries || !ohlcData || ohlcData.length === 0) return;
  candlestickSeries.setData(ohlcData);
  chart.timeScale().fitContent();
}
