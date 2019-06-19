import numeral from 'numeral';

const formatPercent = (price: number) => numeral(price).format('0.0%');

export { formatPercent };
