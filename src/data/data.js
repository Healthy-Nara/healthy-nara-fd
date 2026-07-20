export const content = {
  login: {
    logo: "/images/logo.svg",
    loginTitle: "အကောင့်ထဲဝင်မယ်",
    loginSubTitle:
      "အကောင့်ထဲ ဝင်ဖို့အတွက်  အကောင့်ဖွင့်ထားတဲ့ နာမည်နဲ့ မှတ််ပုံတင်မှ ဂဏန်းတွေကို ဖြည့်ပေးပါ",
    nameLabel: "အကောင့်နာမည်",
    NRCLabel: "မှတ်ပုံတင်နံပါတ် (NRC)",
    eye: "/images/eye.png",
    background: "/images/Background.png",
  },
  footer: {
    loginBtn: "အကောင့်ထဲ ဝင်မယ်",
  },
  dutySession: {
    dutyin: "Duty စဝင်မယ်",
    dutyInBtn: "ဒီကိုနှိပ်ပါ",
    dutyout: "Duty ထွက်မယ်",
    dutyOutBtn: "မလုပ်ရသေးပါ",
    popupImg: "/images/popup.png",
    popupTitle: "Duty စဖို့ Check In ဝင်မယ်",
    popupSub:
      "Assign ချထားတဲ့ Duty စတင်ဖို့အတွက် Duty Check In ဝင်ဖို့ အဆင်အသင့်ဖြစ်ပါပြီ",
    pupupBtn: "Duty Check In ဝင်မယ်",
    dutyStarted: "Duty စတင်ပြီး",
    recordBtn: "Record သိမ်းမယ်",
    recordPopup: {
      title: "Record အမျိုးအစားရွေးပါ",
      subtitle:
        "ကလေးငယ် ပြုစုစောင့်ရှောက်မှုနဲ့ ပက်သတ်ပြီး သက်ဆိုင်ရာ စောင့်ရှောက်မှု အလိုက် record  သွင်းနိုင်ပါတယ်",
      options: [
        { id: 1, label: "တစ်ကိုယ်ရည် သန့်ရှင်းရေး" },
        { id: 2, label: "ကလေးအိပ်စက်ချိန်" },
        { id: 3, label: "အာဟာရတိုက်ကျွေးခြင်း" },
        { id: 4, label: "ကိုယ်လက် လှုပ်ရှားမှုလေ့ကျင့်ခန်း" },
        { id: 5, label: "ထူးခြားဖြစ်စဉ်မှတ်တမ်း" },
      ],
      submitBtn: "Record အမျိုးအစားရွေးမယ်",
    },
    hygieneRecord: {
      title: "တစ်ကိုယ်ရေ သန့်ရှင်းရေး ",
      subtitle:
        "ကလေးငယ် ပြုစုစောင့်ရှောက်မှု Record သွင်းတဲ့ အချိန်မှာ အချိန်တိတိကျကျနဲ့ Recordထည့်ပေးပါ။",
      fields: {
        cleaningTime: "သန့်ရှင်းရေးလုပ်ပေးတဲ့ အချိန်",
        cleaningTimePlaceholder: "အချိန်‌ထည့်မယ်",
        timePeriod: "သန့်ရှင်းရေးအမျိုးအစား",
        timePeriodPlaceholder: "သန့်ရှင်းပေးတဲ့ အမျိုးအစားရွေးချယ်ပါ",
        diaperStatus: "Diaper လဲလှယ်ပေးရတဲ့ အရေအတွက်",
        diaperPlaceholder: "Diaper အ‌ရေအတွက်ထည့်မယ်",
        activityTitle: "ဂရုစိုက်ရမဲ့ ကျန်းမာရေး အခြေအနေရှိမရှိရွေးပေးပါ",
        activityNote:
          "* ဉပမာ ကလေးငယ်မှာဆီးပူ ဝမ်းပူလောင်တာမျိုးရှိမရှိကိုပြောတာပါ",
        activityYes: "ရှိပါတယ်",
        activityNo: "မရှိပါ",
      },
      submitBtn: "Record စာရင်းသွင်းမယ်",
    },
    sleepRecord: {
      title: "ကလေးအိပ်စက်ချိန်",
      subtitle:
        "ကလေးငယ် ပြုစုစောင့်ရှောက်မှု Record သွင်းတဲ့ အချိန်မှာ အချိန်တိတိကျကျနဲ့ Recordထည့်ပေးပါ။",
      fields: {
        sleepTime: "အိပ်စက်ချိန်  အမျိုးအစား",
        sleepTimePlaceholder: "အချိန်အပိုင်းရွေးပါ",
        sleepDuration: "အိပ်ရာနိုးချိန်",
        sleepDurationPlaceholder: "အချိန်ထည့်ပါ",
        sleepPeriod: "အိပ်မောကျချိန်",
        sleepPeriodPlaceholder: "အချိန်ထည့်ပါ",
        sleepDislike: "အိပ်စက်ချိန် မှန်မမှန်",
        sleepDislikeYes: "မှန်တယ်",
        sleepDislikeNo: "မမှန်",
      },
      submitBtn: "Record စာရင်းသွင်းမယ်",
    },
    recordLog: {
      hygieneTitle: "တစ်ကိုယ်ရေ သန့်ရှင်းရေး",
      bathLabel: "ရေချိုးချိန်ပေးလိုက်ပြီ",
      spongeLabel: "ရေပတ်တိုက်ချိန်ပေးလိုက်ပြီ",
      diaperLabel: "Diaper လဲလှယ်",
      times: "ခါ",
      rashLabel: "ဂရုစိုက်ရန်",
      sleepTitle: "အိပ်စက်ချိန်",
      sleepDay: "နေ့ပိုင်း",
      sleepNight: "ညပိုင်း",
      sleepOnSchedule: "အချိန်မှန်",
      sleepOffSchedule: "အချိန်မမှန်",
      feedingTitle: "အာဟာရ",
      activityTitle: "ကိုယ်လက်လှုပ်ရှားမှု",
      abnormalityTitle: "ထူးခြားဖြစ်စဉ်",
      noRecord: "မှတ်တမ်းမရှိသေးပါ",
    },
    nutritionRecord: {
      title: "အာဟာရတိုက်ကျွေးခြင်း",
      subtitle:
        "ကလေးငယ် ပြုစုစောင့်ရှောက်မှု Record သွင်းတဲ့ အချိန်မှာ အချိန်တိတိကျကျနဲ့ Recordထည့်ပေးပါ။",
      fields: {
        nutritionTime: "အာဟာရတိုက်ကျွေးချိန်",
        nutritionTimePlaceholder: "အချိန်‌ထည့်မယ်",
        nutritionType: "အာဟာရအမျိုးအစား",
        nutritionTypePlaceholder: "အာဟာရအမျိုးအစားရွေးချယ်ပါ",
        nutritionAmount: "ပမာဏ",
        nutritionAmountPlaceholder: "ပမာဏထည့်မယ်",
        nutritionDislike: "အာဟာရတိုက်ကျွေးချိန် မှန်မမှန်",
        nutritionDislikeYes: "မှန်တယ်",
        nutritionDislikeNo: "မမှန်",
      },
      submitBtn: "Record စာရင်းသွင်းမယ်",
    },
    exerciseRecord: {
      title: "ကိုယ်လက်လေ့ကျင့်ခန်း",
      subtitle: "ကလေးငယ် ပြုစုစောင့်ရှောက်မှု Record သွင်းတဲ့ အချိန်မှာ အချိန်တိတိကျကျနဲ့ Recordထည့်ပေးပါ။",
      fields: {
        exerciseTime: "လေ့ကျင့်ခန်းလုပ်ပေးတဲ့ အချိန်",
        exerciseTimePlaceholder: "အချိန်ထည့်မယ်",
        exerciseType: "လေ့ကျင့်ခန်းအမျိုးအစား",
        exerciseTypePlaceholder: "လေ့ကျင့်ခန်းအမျိုးအစားရွေးချယ်ပါ",
        exerciseNote: "လေ့ကျင့်ခန်းလုပ်ပေးတဲ့ မှတ်ချက်",
        exerciseNotePlaceholder: "မှတ်ချက်ထည့်မယ်",
      },
      submitBtn: "Record စာရင်းသွင်းမယ်",
    },
    incident: {
      title: "ထူးခြားဖြစ်စဉ်မှတ်တမ်း",
      subtitle: "ကလေးငယ် ပြုစုစောင့်ရှောက်ရာတွင် မူမမှန်တဲ့ ထူးခြားဖြစ်စဉ် တစ်စုံတစ်ရာတွေ့ရပါက ချက်ချင်း Record သွင်းပေးပါ ။ ",
      fields: {
        incidentNote: "ထူးခြားဖြစ်စဉ် အကြောင်း အပြည့်အစုံ",
        incidentNotePlaceholder: "သတိထားမိသမျှ ထူးခြားဖြစ်စဉ်အကြောင်း အပြည်အစုံ ရေးပေးပါ",
      },
      submitBtn: "Record စာရင်းသွင်းမယ်",
    }


  },
  nonDutySession: {
    popupTitle: "Assigned ချထားတဲ့ Duty မရှိသေးပါ",
    popupSub:
      "Healthy Nara Team ဘက်ကနေ Duty Assigned ထည့်ပေးဖို့ အကောင်းဆုံး ကြိုးစားနေပါတယ်",
  },
};
