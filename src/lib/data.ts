export interface Domain {
  id: string;
  name: string;
  provider?: string;
  price?: string;
  status: "available" | "sold" | "reserved";
  link?: string;
  expiryDate?: string; // YYYY-MM-DD
  note?: string;
}

export const initialDomains: Domain[] = [
  { id: "1", name: "PUFF.EE", provider: "Quyu", price: "¥2000", status: "available" },
  { id: "2", name: "SAY.MOM", provider: "Spaceship", price: "¥169", status: "available" },
  { id: "3", name: "MIANLING.CN", provider: "Aliyun", price: "¥299", status: "available" },
  { id: "4", name: "QIAO.SI", provider: "Dynadot", price: "¥900", status: "available" },
  { id: "5", name: "NAV.PM", provider: "Hostinger", price: "¥699", status: "available" },
  { id: "6", name: "HRTIP.COM", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "7", name: "VX.BABY", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "8", name: "1985.ME", provider: "Namecheap", price: "¥599", status: "available" },
  { id: "9", name: "HRDARK.COM", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "10", name: "XIBO.CC", provider: "West", price: "¥199", status: "available" },
  { id: "11", name: "OLD.PINK", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "12", name: "YEYU.FUN", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "13", name: "YUE.LV", provider: "Dynadot", price: "¥399", status: "available" },
  { id: "14", name: "LOGO.BIKE", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "15", name: "NAV.BLUE", provider: "West", price: "¥599", status: "available" },
  { id: "16", name: "YIBAN.ORG", provider: "Spaceship", price: "¥499", status: "available" },
  { id: "17", name: "ZOOEC.COM", provider: "Spaceship", price: "¥999", status: "available" },
  { id: "18", name: "LLL.SKIN", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "19", name: "OI.TO", provider: "NameSilo", price: "¥888", status: "available" },
  { id: "20", name: "III.SKIN", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "21", name: "ZUI.RE", provider: "Hostinger", price: "¥999", status: "available" },
  { id: "22", name: "MAC.RE", provider: "Hostinger", price: "¥999", status: "available" },
  { id: "23", name: "XLI.ST", provider: "Namecheap", price: "¥299", status: "available" },
  { id: "24", name: "IIIV.ORG", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "25", name: "85.TO", provider: "NameSilo", price: "¥888", status: "available" },
  { id: "26", name: "LOG.PICS", provider: "Spaceship", price: "¥399", status: "available" },
  { id: "27", name: "MRMI.TOP", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "28", name: "800.CX", provider: "West", price: "¥666", status: "available" },
  { id: "29", name: "SVIP.LI", provider: "Dynadot", price: "¥599", status: "available" },
  { id: "30", name: "YUN.PINK", provider: "West", price: "¥299", status: "available" },
  { id: "31", name: "MIDOG.ORG", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "32", name: "OYESE.COM", provider: "Spaceship", price: "¥499", status: "available" },
  { id: "33", name: "MIWU.ORG", provider: "Spaceship", price: "¥500", status: "available" },
  { id: "34", name: "MOXU.XYZ", provider: "Spaceship", price: "¥300", status: "available" },
  { id: "35", name: "SSS.KIM", provider: "Spaceship", price: "¥200", status: "available" },
  { id: "36", name: "LLL.KIM", provider: "Spaceship", price: "¥200", status: "available" },
  { id: "37", name: "SHAN.IM", provider: "Dynadot", price: "¥299", status: "available" },
  { id: "38", name: "SUYE.CC", provider: "West", price: "¥199", status: "available" },
  { id: "39", name: "GUFF.CC", provider: "West", price: "¥199", status: "available" },
  { id: "40", name: "RAR.CX", provider: "West", price: "¥999", status: "available" },
  { id: "41", name: "VPS.TAXI", provider: "Quyu", price: "¥666", status: "available" },
  { id: "42", name: "MOTS.CC", provider: "West", price: "¥199", status: "available" },
  { id: "43", name: "00.MOM", provider: "Spaceship", price: "¥99", status: "available" },
  { id: "44", name: "TI.MOM", provider: "Spaceship", price: "¥99", status: "available" },
  { id: "45", name: "CSS.DOG", provider: "Porkbun", price: "¥299", status: "available" },
  { id: "46", name: "BBB.LAT", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "47", name: "ZZZ.LAT", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "48", name: "ZUN.IM", provider: "Dynadot", price: "¥299", status: "available" },
  { id: "49", name: "RUN.BZ", provider: "Namecheap", price: "¥399", status: "available" },
  { id: "50", name: "SAY.LI", provider: "Dynadot", price: "¥299", status: "available" },
  { id: "51", name: "CCC.ZONE", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "52", name: "BBS.RENT", provider: "Spaceship", price: "¥999", status: "available" },
  { id: "53", name: "SUJI.PRO", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "54", name: "REPAN.TOP", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "55", name: "YMS.IM", provider: "Dynadot", price: "¥199", status: "available" },
  { id: "56", name: "IFGOO.COM", provider: "Spaceship", price: "¥499", status: "available" },
  { id: "57", name: "OOO.PLUS", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "58", name: "BUZUO.CN", provider: "Aliyun", price: "¥299", status: "available" },
  { id: "59", name: "TI.QUEST", provider: "Spaceship", price: "¥99", status: "available" },
  { id: "60", name: "BLOGER.CLUB", provider: "Namecheap", price: "¥299", status: "available" },
  { id: "61", name: "URLS.BEST", provider: "Namecheap", price: "¥699", status: "available" },
  { id: "62", name: "JIAOCAI.XYZ", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "63", name: "LVKE.ME", provider: "Namecheap", price: "¥299", status: "available" },
  { id: "64", name: "MILV.XYZ", provider: "Spaceship", price: "¥199", status: "available" },
  { id: "65", name: "EDC.PLUS", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "66", name: "LIAOLIAO.SPACE", provider: "Spaceship", price: "¥299", status: "available" },
  { id: "67", name: "BOKEBANG.COM", provider: "Spaceship", price: "¥499", status: "available" }
];

export const siteConfig = {
  title: "SOMI.im",
  subtitle: "So mi, I'm here.",
  description: "Somi Domain Name List",
  footerText: "2026年春节活动，联系询价就折上折！",
  contactEmail: "contact@somi.im",
  footerLinks: [
    { title: "My Nav", desc: "My Personal Navigation", url: "#" },
    { title: "xLIST", desc: "My Minimalist Page", url: "#" },
    { title: "Pay", desc: "Secure Payment · 点击支付！", url: "#" },
    { title: "Contact", desc: "Get In Touch · 联系询价！", url: "mailto:contact@somi.im" },
  ],
  footerIcons: [
    { title: "Umami", src: "https://somi.im/umami.ico", url: "https://us.umami.is/share/..." },
    { title: "Domain.Cards", src: "https://domain.cards/api/icon/somi.im", url: "https://domain.cards" },
    { title: "Airport", src: "https://somi.im/air.ico", url: "#" },
    { title: "14.cx", src: "https://somi.im/14.ico", url: "https://14.cx" },
    { title: "HiVPS", src: "https://somi.im/v.ico", url: "#" },
    { title: "My Blog", src: "https://evan.xin/favicon.ico", url: "https://evan.xin" }
  ]
};
