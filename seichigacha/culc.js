var israndom = true;
var exchange_count = -1;
var exchange_gtooatari = 1;
var exchange_ooatari = 1;
var exchange_atari = 1;
const gacha_probs = [0.001, 0.001, 0.009, 0.09, 0.1, 0.1, 0.699];//gt,椎名,大当たり,当たり,経験値,ギフト券,がちゃりんご
function to_stLC(amount) {
  var result = [];
  if (amount >= 3456) {
    result.push(Math.floor(amount / 3456) + "LC");
    amount = amount % 3456;
  }
  if (amount >= 64) {
    result.push(Math.floor(amount / 64) + "st");
    amount = amount % 64;
  }
  result.push(Math.round(amount * (10 ** 4)) / (10 ** 4).toString());
  return result.join("+");
}
function prize_factor() { return [1, 1, 1, 1, 20, 2, 1] }
function culc_rand_once(amount) {
  var gacha_amounts = [0, 0, 0, 0, 0, 0, 0];
  var rannum;
  for (let i = 0; i < amount; i++) {
    rannum = Math.random();
    for (let j = 0; j < gacha_probs.length; j++) {
      if (rannum > gacha_probs[j]) {
        rannum -= gacha_probs[j];
        continue;
      }
      gacha_amounts[j]++;
      break;
    }

  }
  return gacha_amounts;
}
function culc_rand(amount) {
  var gacha_sum = [0, 0, 0, 0, 0, 0, 0];
  var diff = culc_rand_once(amount);
  var ticket_return = Math.ceil(diff[2] * exchange_ooatari) * 12 + Math.ceil(diff[3] * exchange_atari) * 3;
  for (let i = 0; (i != exchange_count) && (ticket_return); i++) {
    diff[2] -= Math.ceil(diff[2] * exchange_ooatari);
    diff[3] -= Math.ceil(diff[3] * exchange_atari);
    gacha_sum = gacha_sum.map((e, i) => (e + diff[i]));
    diff = culc_rand_once(ticket_return);
    ticket_return = Math.ceil(diff[2] * exchange_ooatari) * 12 + Math.ceil(diff[3] * exchange_atari) * 3;
  }
  gacha_sum = gacha_sum.map((e, i) => (e + diff[i]));
  gacha_sum[1] += Math.ceil(gacha_sum[0] * exchange_gtooatari) * 4;
  gacha_sum[0] -= Math.ceil(gacha_sum[0] * exchange_gtooatari);
  return gacha_sum.map((e, i) => (e * prize_factor()[i]));
}
function culc_mea(amount) {
  var gacha_return = [
    gacha_probs[0], gacha_probs[1],//gt,椎名
    gacha_probs[2] * (1 - exchange_ooatari), gacha_probs[2] * exchange_ooatari,//確保大当たり,解体大当たり
    gacha_probs[3] * (1 - exchange_atari), gacha_probs[3] * exchange_atari,//確保当たり,解体当たり
    gacha_probs[4], gacha_probs[5], gacha_probs[6]];//経験値,ギフト券,がちゃりんご
  var ticket_return = gacha_return[3] * 12 + gacha_return[5] * 3;
  if (exchange_count == -1) {
    var factor = 1 / (1 - ticket_return);
    gacha_return = gacha_return.map((e) => (e * factor));
    gacha_return[3] = 0;
    gacha_return[5] = 0;
  } else {
    var factor = (1 - ticket_return ** (exchange_count + 1)) / (1 - ticket_return);
    gacha_return = gacha_return.map((e) => (e * factor));
    gacha_return[3] *= ticket_return ** exchange_count;
    gacha_return[5] *= ticket_return ** exchange_count;
  }
  var return_per_ticket = [0, 1, 2, 4, 6, 7, 8].map((i) => (gacha_return[i]));
  return_per_ticket[2] += gacha_return[3];
  return_per_ticket[3] += gacha_return[5];
  return_per_ticket[1] += return_per_ticket[0] * exchange_gtooatari * 4;
  return_per_ticket[0] *= 1 - exchange_gtooatari;
  return return_per_ticket.map((e, i) =>
  (Math.round(
    e * amount * prize_factor()[i] * (10 ** 6)
  ) / (10 ** 6)));
}
/**
 * @type {linkedNumAndRange}
 */
var atariInputs;
/**
 * @type {linkedNumAndRange}
 */
var ooatariInputs;
/**
 * @type {linkedNumAndRange}
 */
var gtooatariInputs;
/**
 * @type {linkedNumAndRange}
 */
var countloopInputs;
/**
 * @type {HTMLElement}
 */
var button_inf;
function init_gacha() {
  atariInputs =
    new linkedNumAndRange(document.getElementById("atari"), "atari");
  atariInputs.class = "linkedInput";
  ooatariInputs =
    new linkedNumAndRange(document.getElementById("ooatari"), "ooatari");
  ooatariInputs.class = "linkedInput";
  gtooatariInputs =
    new linkedNumAndRange(document.getElementById("gtooatari"), "gtooatari");
  gtooatariInputs.class = "linkedInput";
  countloopInputs =
    new linkedNumAndRange(document.getElementById("kaitai"), "kaitai", 0, 20, 1);
  countloopInputs.class = "linkedInput";
  button_inf = document.getElementById("kaitai_inf");
  button_inf.addEventListener("change", () => {
    countloopInputs.inputNum.disabled = !countloopInputs.inputNum.disabled;
    countloopInputs.inputRange.disabled = !countloopInputs.inputRange.disabled;
  })
}
async function run_gacha() {
  exchange_atari = atariInputs.inputNum.value - 0;
  exchange_ooatari = ooatariInputs.inputNum.value - 0;
  exchange_gtooatari = gtooatariInputs.inputNum.value - 0;
  exchange_count = button_inf.checked ?
    -1 : (countloopInputs.inputNum.value - 0);
  ismean = document.getElementById("mean").checked;
  var resultcontainer = document.getElementById("result");
  var chickets_count = document.getElementById("ticket").value - 0;
  var result;
  resultcontainer.innerText = "計算中...";
  await new Promise(r => setTimeout(r, 0));
  if (ismean) {
    result = culc_mea(chickets_count);
  } else {
    result = culc_rand(chickets_count);
  }
  resultcontainer.innerText =
    "GT大当たり: " + result[0] + "個\n" +
    "椎名林檎: " + result[1] + "個 (" + to_stLC(result[1]) + "個)\n" +
    "大当たり: " + result[2] + "個\n" +
    "当たり: " + result[3] + "個\n" +
    "経験値瓶: " + result[4] + "個 (" + to_stLC(result[4]) + "個)\n" +
    "ギフト券: " + result[5] + "枚 (" + to_stLC(result[5]) + "枚)\n" +
    "がちゃりんご: " + result[6] + "個 (" + to_stLC(result[6]) + "個)\n";
}