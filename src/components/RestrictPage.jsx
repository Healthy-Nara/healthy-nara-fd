function RestrictPage() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white hidden md:flex flex-col items-center justify-center gap-4 px-10">
      <img src="/images/logo.svg" alt="logo" className="w-[100px]" />
      <p className="font-nato text-[16px] text-secondry font-bold text-center">
        ဤ Application ကို ဖုန်းများအတွက်သာ ရည်ရွယ်ပါသည်
      </p>
      <p className="font-nato text-[12px] text-gary text-center">
        ကျေးဇူးပြု၍ သင့်ဖုန်းမှ ဝင်ရောက်ပါ
      </p>
    </div>
  );
}

export default RestrictPage;
