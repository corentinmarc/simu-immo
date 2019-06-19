import numeral from 'numeral';

const formatPrice = (price: number) => numeral(price).format('0,0');

export { formatPrice };
