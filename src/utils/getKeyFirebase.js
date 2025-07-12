function getCollectionByCategory(code) {
  switch (code) {
    case 'Tai nghe nhét tai cũ':
      return '01-nhet-tai-cu';
    case 'Tai nghe chụp tai cũ':
      return '02-chup-tai-cu';
    case 'Loa di động cũ':
      return '03-di-dong-cu';
    case 'Loa để bàn cũ':
      return '04-de-ban-cu';
    case 'Loa karaoke cũ':
      return '05-loa-karaoke';
    case 'Hàng newseal':
      return '06-hang-newseal';
    default:
      return 'test';
  }
}

function getCategoryByCollection(collection) {
  switch (collection) {
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
      return 'Hàng newseal';
    default:
      return '';
  }
}

export {getCollectionByCategory, getCategoryByCollection}