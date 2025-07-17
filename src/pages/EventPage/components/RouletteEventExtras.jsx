import swimmingtong from '@/assets/image/swimmingtong.png';

const RouletteEventExtras = () => {
  return (
    <div className="relative w-full mt-[40px] select-none pointer-events-none">
      {/* 중앙 문구 */}
      <div className="text-center font-semibold text-[20px] leading-[24px] text-[#F6F7FC] whitespace-pre-line relative z-10">
        하루 1번! 룰렛을 돌리면{'\n'}쿠폰이 팡팡!!
      </div>

      {/* 캐릭터 - 오른쪽 아래에 절대 위치 */}
      <img
        src={swimmingtong}
        alt="swimmingtong"
        className="absolute right-0  pointer-events-none select-none z-20"
      />
    </div>
  );
};

export default RouletteEventExtras;
