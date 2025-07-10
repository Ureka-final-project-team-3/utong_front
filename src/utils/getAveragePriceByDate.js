// utils/getAveragePriceByDate.js
export function getAveragePriceByDate(priceData) {
  // 날짜별 price + volume 배열로 그룹화
  const groupedByDate = priceData.reduce((acc, { timestamp, price, volume }) => {
    const date = timestamp.split('T')[0]; // 예: "2025-07-04"
    if (!acc[date]) acc[date] = { prices: [], totalVolume: 0 };
    acc[date].prices.push(price);
    acc[date].totalVolume += volume;
    return acc;
  }, {});

  // 날짜별 평균 가격 + 총 거래량 계산
  const averageByDate = Object.entries(groupedByDate).map(([date, { prices, totalVolume }]) => {
    const average =
      prices.reduce((sum, p) => sum + p, 0) / prices.length;
    return {
      date,
      averagePrice: Math.round(average),
      totalVolume,
    };
  });

  return averageByDate;
}
