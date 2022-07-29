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
                if (!isNaN(result) && result.toString(10).length === (obj[key]).length && !Array.isArray(obj[key])) {
                    obj[key] = result;
                } else {
                    if (obj[key] === 'true') {
                        obj[key] = true;
                    } else if (obj[key] === 'false') {
                        obj[key] = false;
                    } else if (obj[key] === '') {
                        obj[key] = null;
                    }
                }
            }
        }
    }
    return obj;
};
