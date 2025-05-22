// Для параметров передающихся через GET, необходимо преобразовывать строки типа 'true' и числа '2' в их
// Соответствующие типы
export const replaceStrings = obj=> {
    if (obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key) ) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                        obj[key] = replaceStrings(obj[key]);
                    }
                if (Array.isArray(obj[key])) {
                    obj[key] = replaceStrings(obj[key]);
                }
                const result = parseInt(obj[key], 10);
            }
        }
    }
    return obj;
};
