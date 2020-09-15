const axios = require('axios')
const cheerio = require('cheerio')
const date = '2020-09-14'
function getMatch (d) {
  axios.get('https://www.iuliao.com/live?issue=' + d).then(async res => {
    const $ = cheerio.load(res.data)
    const match = $('.normal-table>tbody>tr')
    const arr = []
    match.each(function (i, elem) {
      const dom = cheerio.load(elem)
      arr.push({
        ht: dom('.home>a').text(),
        at: dom('.away>a').text(),
        id: dom('tr').attr('data-mid'),
        hs: dom('.score .home').text(),
        as: dom('.score .away').text(),
      })
    })
    let l = []
    for (const key of arr) {
      let obj = await getOddsData(key)
      l.push({
        ...key,
        ...obj
      })
    }
    let bet = filterMatch(l)
    console.log(bet)
  })
}

async function getOddsData (key) {
  console.log(`加载${key.ht}vs${key.ht}的比赛`)
  let res = await axios.get(`https://www.iuliao.com/odds/match/${key.id}/europe`)
  console.log(`加载完成${key.ht}vs${key.ht}的比赛`)
  const $ = cheerio.load(res.data)
  return {
    w1: $('tr[data-cid=10000] .odds-win>.lastdata').text() - 0,
    d1: $('tr[data-cid=10000] .odds-draw>.lastdata').text() - 0,
    l1: $('tr[data-cid=10000] .odds-lost>.lastdata').text() - 0,
    w2: $('tr[data-cid=442] .odds-win>.lastdata').text() - 0,
    d2: $('tr[data-cid=442] .odds-draw>.lastdata').text() - 0,
    l2: $('tr[data-cid=442] .odds-lost>.lastdata').text() - 0,
    w3: $('tr[data-cid=30] .odds-win>.lastdata').text() - 0,
    d3: $('tr[data-cid=30] .odds-draw>.lastdata').text() - 0,
    l3: $('tr[data-cid=30] .odds-lost>.lastdata').text() - 0,
  }
}


function filterMatch (arr) {
  let match = []
  let sum = 0
  arr.forEach(item => {
    if (item.w1) {
      if ((item.w1 < item.w2) && (item.d1 >= item.d2) && (item.l1 - 0 >= item.l2 - 0)) {
        match.push(item)
        if (item.hs > item.as) {
          sum += item.w3 * 100 - 100
        } else {
          sum = sum - 100
        }
      } else if ((item.w1 >= item.w2) && (item.d1 >= item.d2) && (item.l1 < item.l2)) {
        match.push(item)
        if (item.hs < item.as) {
          sum += item.l3 * 100 - 100
        } else {
          sum = sum - 100
        }
      }
    }
  })
  console.log(match)
  console.log(sum)
  return match
}

// filterMatch(arr)
// getOddsData(1445520)
getMatch(date)