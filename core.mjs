export const DAILY_ID='00000000-0000-0000-0000-000000000001';
export const APPLE_EPOCH=978307200000;
export const CATEGORY_DATA=[
['餐饮','早餐 早饭 午饭 午餐 晚饭 晚餐 夜宵 外卖 吃饭 火锅 面条 烧烤 包子'],
['饮品','咖啡 奶茶 饮料 矿泉水 果汁 啤酒 酒水'],['买菜食材','买菜 食材 蔬菜 鸡蛋 猪肉 牛肉 大米 海鲜'],
['水果零食','水果 零食 苹果 香蕉 饼干 薯片 巧克力'],['交通','地铁 公交 打车 出租车 滴滴 高铁 火车 车票 单车'],
['日用百货','纸巾 洗衣液 洗洁精 牙膏 日用 百货 超市 购物 快递'],['服饰鞋包','衣服 裤子 鞋 外套 衬衫 裙 背包 手提包'],
['居住','房租 房贷 物业 水费 电费 燃气 装修 家具 家电'],['通讯网络','话费 宽带 流量 网费 电话费'],
['数码电器','手机 电脑 耳机 键盘 鼠标 相机 数码 平板'],['娱乐休闲','电影 游戏 演唱会 KTV 会员 音乐 追剧'],
['运动健身','健身 游泳 球场 瑜伽 运动 羽毛球 跑步'],['美容护理','理发 美发 护肤 化妆 美甲 美容 洗面奶'],
['医疗健康','医院 挂号 看病 买药 药品 体检 牙科 疫苗'],['教育学习','学费 培训 课程 教材 买书 考试 文具'],
['旅行','旅游 旅行 酒店 民宿 景点 机票 签证'],['汽车','加油 充电桩 洗车 保养 停车 过路费 高速费 修车'],
['宠物','猫粮 狗粮 宠物 猫砂 兽医'],['育儿','奶粉 尿布 纸尿裤 托儿 婴儿 童装 玩具'],
['保险','保险 保费'],['人情礼赠','红包 份子 礼金 礼物 送礼 捐款'],['其他','']];
export const THEMES={
'青绿':['#168d83','#e2f1ee','#f3f6f5','#1e3634','#718582'],
'海盐蓝':['#548ca5','#e4f0f5','#f3f7f9','#293c47','#758b98'],
'薰衣紫':['#8d7bb7','#eee8f7','#f7f5fa','#3d354d','#8c819c'],
'雾玫粉':['#b07886','#f6e7eb','#faf5f6','#48353d','#9b818b'],
'杏桃橙':['#bd8964','#f9eadd','#fbf7f2','#4c3d32','#9b8877'],
'深灰':['#616973','#e6e9ec','#f4f5f6','#2f363e','#838b93']};
export const CHART_COLORS=['#27b7a6','#ffae65','#7ca5f2','#f37c96','#aa89e3','#efcd62','#63c7df','#ee946d','#83bf6b','#d982c1','#67aeb3','#bc9d72'];
export function initialState(){return {version:1,books:[{id:DAILY_ID,name:'日常账本',photo:null}],entries:[],budgets:[],categories:CATEGORY_DATA.map(([name,words])=>({name,keywords:words?words.split(' '):[]})),preferences:{theme:'青绿',appearance:'跟随系统',nickname:'我的账本',avatar:null},recycleBin:[],deletedBudgets:[]};}
export const uid=()=>crypto.randomUUID();
export const clone=value=>JSON.parse(JSON.stringify(value));
export const money=cents=>(cents<0?'-¥':'¥')+(Math.abs(cents)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
export function parseCents(text){text=String(text).trim();if(!/^\d+(\.\d{1,2})?$/.test(text))return null;const [a,b='']=text.split('.');const cents=Number(a)*100+Number(b.padEnd(2,'0'));return Number.isSafeInteger(cents)&&cents>0&&cents<=99999999900?cents:null;}
export function inferCategory(title,categories){let result='其他',best=0;for(const c of categories){if(c.name==='其他')continue;for(const word of [c.name,...c.keywords])if(word.length>best&&title.toLowerCase().includes(word.toLowerCase())){best=word.length;result=c.name;}}return result;}
export function parseMessage(text,bookID,categories,now=new Date()){
const match=String(text).trim().match(/^([^\d\r\n]+?)\s*[¥￥]?\s*(\d+(?:\.\d{1,2})?)\s*元?$/);if(!match)return null;
const title=match[1].trim(),cents=parseCents(match[2]);if(!title||/[-−.]$/.test(title)||!cents)return null;
return {id:uid(),title,cents,category:inferCategory(title,categories),date:now.toISOString(),bookID,income:false};}
export function dayStart(value){const d=new Date(value);d.setHours(0,0,0,0);return d;}
export function monthStart(value){const d=dayStart(value);d.setDate(1);return d;}
export function yearStart(value){const d=monthStart(value);d.setMonth(0);return d;}
export function addCalendar(value,count,unit){const a=new Date(value),d=new Date(a);if(unit==='天'||unit==='周'){d.setDate(d.getDate()+count*(unit==='周'?7:1));return d;}const originalDay=a.getDate();d.setDate(1);if(unit==='月')d.setMonth(a.getMonth()+count);else d.setFullYear(a.getFullYear()+count);const end=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(originalDay,end));return d;}
export function intervalFor(kind,anchor=new Date()){const start=kind==='day'?dayStart(anchor):kind==='month'?monthStart(anchor):yearStart(anchor);return {start,end:addCalendar(start,1,kind==='day'?'天':kind==='month'?'月':'年')};}
export function filtered(entries,interval,bookID=null,category=null){return entries.filter(e=>!e.income&&(!interval||(new Date(e.date)>=interval.start&&new Date(e.date)<interval.end))&&(!bookID||(e.bookID||DAILY_ID)===bookID)&&(!category||category==='全部分类'||e.category===category));}
export const total=entries=>entries.reduce((n,e)=>n+(e.income?0:e.cents),0);
export function budgetInterval(budget,now=new Date()){
const start=dayStart(budget.start);if(now<start)return null;const length=budget.length||1,unit=budget.unit||'月';
let index=unit==='月'?Math.floor(((now.getFullYear()-start.getFullYear())*12+now.getMonth()-start.getMonth())/length):unit==='年'?Math.floor((now.getFullYear()-start.getFullYear())/length):Math.floor((dayStart(now)-start)/86400000/(length*(unit==='周'?7:1)));
index=Math.max(0,index);while(index>0&&addCalendar(start,index*length,unit)>now)index--;while(addCalendar(start,(index+1)*length,unit)<=now)index++;
return {start:addCalendar(start,index*length,unit),end:addCalendar(start,(index+1)*length,unit)};}
export function barPoints(entries,mode,anchor=new Date(),now=new Date()){
if(mode==='月'){const start=yearStart(anchor);return Array.from({length:12},(_,i)=>{const date=addCalendar(start,i,'月');return {key:String(i+1),label:`${i+1}月`,date,cents:total(filtered(entries,intervalFor('month',date)))};});}
const years=entries.filter(e=>!e.income).map(e=>new Date(e.date).getFullYear()),current=now.getFullYear();const lo=Math.min(current-4,...years),hi=Math.max(current,...years);
return Array.from({length:hi-lo+1},(_,i)=>{const year=lo+i,date=new Date(year,0,1);return {key:String(year),label:String(year),date,cents:total(filtered(entries,intervalFor('year',date)))};});}
export function heatLevel(cents,maximum){if(cents<=0||maximum<=0)return 0;return Math.max(1,Math.min(5,Math.ceil(Math.log1p(cents/100)/Math.log1p(maximum/100)*5)));}
export function validateState(state){
const fail=message=>{throw new Error(message);};if(!state||!Array.isArray(state.books)||!Array.isArray(state.entries)||!Array.isArray(state.budgets)||!Array.isArray(state.categories)||!Array.isArray(state.recycleBin)||!Array.isArray(state.deletedBudgets))fail('备份格式不完整');
if(state.entries.length+state.recycleBin.length>200000||state.budgets.length+state.deletedBudgets.length>10000||state.books.length>500||state.categories.length>500)fail('备份数据量超出支持范围');
const unique=(items,key)=>new Set(items.map(i=>i[key])).size===items.length;
if(!unique(state.books,'id')||!unique(state.categories,'name'))fail('账本或分类重复');
const entries=[...state.entries,...state.recycleBin.map(x=>x.entry)],budgets=[...state.budgets,...state.deletedBudgets.map(x=>x.budget)];
if(!unique(entries,'id')||!unique(budgets,'id'))fail('账单或预算编号重复');
const validDate=d=>Number.isFinite(new Date(d).getTime())&&new Date(d)>=new Date('1900-01-01')&&new Date(d)<=new Date('2200-01-01');
const validID=id=>typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
const validAmount=n=>Number.isSafeInteger(n)&&n>0&&n<=99999999900;
const bookIDs=new Set(state.books.map(b=>b.id));if(!bookIDs.has(DAILY_ID))fail('缺少日常账本');
const catNames=new Set(state.categories.map(c=>c.name));if(!catNames.has('其他'))fail('缺少其他分类');
if(state.categories.some(c=>typeof c.name!=='string'||!c.name.trim()||c.name.length>20||c.name==='全部分类'||!Array.isArray(c.keywords)||c.keywords.some(k=>typeof k!=='string'||!k)))fail('分类内容无效');
const validPhoto=p=>p==null||(typeof p==='string'&&p.length<=2800000&&/^data:image\/(jpeg|png|webp|heic);base64,[A-Za-z0-9+/=\r\n]+$/.test(p));
if(state.books.some(b=>!validID(b.id)||typeof b.name!=='string'||!b.name.trim()||b.name.length>100||!validPhoto(b.photo)))fail('账本或照片无效');
if(entries.some(e=>!validID(e.id)||!validAmount(e.cents)||typeof e.title!=='string'||!e.title.trim()||e.title.length>2000||!validDate(e.date)||!bookIDs.has(e.bookID||DAILY_ID)||!catNames.has(e.category)))fail('账单金额、日期或分类无效');
if(budgets.some(b=>!validID(b.id)||typeof b.name!=='string'||!b.name.trim()||b.name.length>100||!validAmount(b.cents)||!validDate(b.start)||!Number.isInteger(b.length)||b.length<1||b.length>999||!['天','周','月','年'].includes(b.unit)||(b.bookID&&!bookIDs.has(b.bookID))||!(b.category==='全部分类'||catNames.has(b.category))))fail('预算金额或周期无效');
if(!state.preferences||!validPhoto(state.preferences.avatar)||typeof state.preferences.nickname!=='string'||state.preferences.nickname.length>100)fail('偏好设置无效');return state;
}
const dateFromNative=d=>typeof d==='number'?new Date(APPLE_EPOCH+d*1000).toISOString():new Date(d).toISOString();
const toNativeDate=d=>(new Date(d).getTime()-APPLE_EPOCH)/1000;
function fromPhoto(p){return !p?null:p.startsWith('data:')?p:`data:image/jpeg;base64,${p}`;}
function toPhoto(p){return p?p.split(',')[1]:null;}
export function fromNativeArchive(archive){
if(!archive||!Array.isArray(archive.entries)||!Array.isArray(archive.budgets))throw new Error('文件不是完整的流水账备份');
const state=initialState();state.books=(archive.books||state.books).map(b=>({...b,photo:fromPhoto(b.photo)}));if(!state.books.some(b=>b.id===DAILY_ID))state.books.unshift(initialState().books[0]);
state.categories=archive.categories||state.categories;if(!state.categories.some(c=>c.name==='其他'))state.categories.push({name:'其他',keywords:[]});
const known=new Set(state.categories.map(c=>c.name));
const entry=e=>({...e,date:dateFromNative(e.date),bookID:e.bookID||DAILY_ID,income:!!e.income,category:known.has(e.category)?e.category:'其他'});
const budget=b=>({...b,start:dateFromNative(b.start),length:b.length||1,unit:b.unit||(b.kind==='每年'||b.kind==='年预算'?'年':b.kind==='自定义'?'天':'月'),category:known.has(b.category)?b.category:'全部分类'});
state.entries=(archive.entries||[]).map(entry);state.budgets=(archive.budgets||[]).map(budget);
state.recycleBin=(archive.recycleBin||[]).map(x=>({entry:entry(x.entry),deletedAt:dateFromNative(x.deletedAt)}));state.deletedBudgets=(archive.deletedBudgets||[]).map(x=>({budget:budget(x.budget),deletedAt:dateFromNative(x.deletedAt)}));
state.preferences={...state.preferences,...archive.preferences,avatar:fromPhoto(archive.preferences?.avatar)};const oldThemes={'石墨':'深灰','松石绿':'青绿','海蓝':'海盐蓝','鸢紫':'薰衣紫','玫瑰':'雾玫粉','暖橙':'杏桃橙'};state.preferences.theme=oldThemes[state.preferences.theme]||state.preferences.theme;
return validateState(state);
}
export function toNativeArchive(state){validateState(state);const entry=e=>({...e,date:toNativeDate(e.date)});const budget=b=>({...b,start:toNativeDate(b.start),end:toNativeDate(b.start),kind:b.unit==='月'&&b.length===1?'每月':b.unit==='年'&&b.length===1?'每年':'自定义'});
return {books:state.books.map(b=>({...b,photo:toPhoto(b.photo)})),categories:state.categories,preferences:{...state.preferences,avatar:toPhoto(state.preferences.avatar)},entries:state.entries.map(entry),budgets:state.budgets.map(budget),recycleBin:state.recycleBin.map(x=>({entry:entry(x.entry),deletedAt:toNativeDate(x.deletedAt)})),deletedBudgets:state.deletedBudgets.map(x=>({budget:budget(x.budget),deletedAt:toNativeDate(x.deletedAt)}))};}
export async function encodeBackup(state){const data=new TextEncoder().encode(JSON.stringify(toNativeArchive(state)));const digest=await crypto.subtle.digest('SHA-256',data);const checksum=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');let binary='';for(let i=0;i<data.length;i++)binary+=String.fromCharCode(data[i]);return JSON.stringify({format:'FreeLedgerBackup',version:1,createdAt:toNativeDate(new Date()),payload:btoa(binary),checksum},null,2);}
export async function decodeBackup(text){if(new TextEncoder().encode(text).length>50000000)throw new Error('备份不能超过 50 MB');let value;try{value=JSON.parse(text);}catch{throw new Error('文件不是有效的 JSON 备份');}
if(value.format){if(value.format!=='FreeLedgerBackup'||value.version!==1)throw new Error('不支持这个备份版本');const binary=atob(value.payload);const bytes=Uint8Array.from(binary,x=>x.charCodeAt(0));const digest=await crypto.subtle.digest('SHA-256',bytes);const checksum=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');if(checksum!==value.checksum)throw new Error('备份校验失败，请使用完整文件');value=JSON.parse(new TextDecoder().decode(bytes));}
return fromNativeArchive(value);}
export function csvExport(state){const cell=value=>'"'+(/^[=+@-]/.test(String(value).trim())?"'":'')+String(value).replaceAll('"','""')+'"';return '\ufeff'+[['编号','时间','账本','用途','分类','支出金额（元）'],...state.entries.filter(e=>!e.income).sort((a,b)=>b.date.localeCompare(a.date)).map(e=>[e.id,e.date,state.books.find(b=>b.id===(e.bookID||DAILY_ID))?.name||'日常账本',e.title,e.category,(e.cents/100).toFixed(2)])].map(row=>row.map(cell).join(',')).join('\r\n');}
