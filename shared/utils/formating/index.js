import moment from 'moment';

export function numberFormat(x = '', buyPrice = 0) {
  if (x < 0.0000001 && x > 0) {
    return 0;
  } else if (x < 1 && x > 0.0000001) {
    x = x.toFixed(6);
    return x;
  } else if (x >= 1 && x <= 10) {
    x = x.toFixed(2);
  } else if (x > 10) {
    if (x % 1) {
      x = x.toFixed(1);
    }
  } else if (x < 0) {
    x = x.toFixed(2);
  }
  if (!buyPrice && x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return x;
}

export function priceBtcFormat(x) {
  if (x === 1) {
    return '1.00000000';
  }
  if (+x < 0.00000001) {
    return 0;
  }
  if (x % 1) x = x.toFixed(8);

  return x;
}

export function formatDate(date, format = 'DD/MM/YYYY') {
  return moment(date).format(format);
}

export function formatPercent(percent) {
  return percent.toFixed(2);
}

export const differenceInDays = (date) => {
  if (isNaN(new Date(date).getTime())) {
    return false;
  }
  const timeDiff = new Date().getTime() - new Date(date);
  const diffDays = timeDiff / (1000 * 3600 * 24);
  if (diffDays < 1) {
    const hourDiff = diffDays * 24;
    if (hourDiff < 1) {
      if (Math.round(hourDiff * 60) < 0) {
        return 'Just now';
      }
      return `${Math.round(hourDiff * 60)} minutes ago`;
    }
    if (hourDiff === 1) {
      return 'An hour ago';
    }
    return `${Math.round(hourDiff)} hours ago`;
  } else if (Math.round(diffDays === 1)) {
    return 'Day ago';
  } else if (diffDays < 30) {
    return `${Math.round(diffDays)} days ago`;
  } else if (diffDays < 365) {
    return `${Math.round(diffDays / 30)} months ago`;
  }
  return `${Math.round(diffDays / (30 * 365))} years ago`;
};
