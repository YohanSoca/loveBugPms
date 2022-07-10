export const d2b = x => x.toString(2);
export const b2d = x => parseInt(x,2);
export const flip = (num, i) => num ^ (1 << i - 1)
export const query = (num, i) => !((num & (1 << i)) === 0)

export const bit_test = (num, bit) =>{
    return ((num>>bit) % 2 != 0)
}

export const bit_set = (num, bit) => {
    return num | 1<<bit;
}

export const bit_clear = (num, bit) => {
    return num & ~(1<<bit);
}

export const bit_toggle = (num, bit) => {
    return bit_test(num, bit) ? bit_clear(num, bit) : bit_set(num, bit);
}