function getCollectionNameByCode(code) {
  switch (code) {
    case '03-di-dong-cu':
      return '03-di-dong-cu';
    case '05-loa-karaoke':
      return '05-loa-karaoke';
    case '04-de-ban-cu':
      return '04-de-ban-cu';
    case '02-chup-tai-cu':
      return '02-chup-tai-cu';
    case '01-nhet-tai-cu':
      return '01-nhet-tai-cu';
    case '06-hang-newseal':
      return '06-hang-newseal';
    default:
      return 'test';
  }
}

function getCategoryByCode(code) {
  switch (code) {
    case '01-nhet-tai-cu':
      return 'Tai nghe nhét tai cũ';
    case '02-chup-tai-cu':
      return 'Tai nghe chụp tai cũ';
    case '03-di-dong-cu':
      return 'Loa di động cũ';
    case '04-de-ban-cu':
      return 'Loa để bàn cũ';
    case '05-loa-karaoke':
      return 'Loa karaoke cũ';
    case '06-hang-newseal':
      return 'Hàng new seal';
    default:
      return '';
  }
}

export {getCollectionNameByCode, getCategoryByCode}