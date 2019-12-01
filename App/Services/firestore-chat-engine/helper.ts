import { equals } from "ramda";
import moment from 'moment';
import { ORDER_TYPE } from "./const";

export function arrayEqual(arr1: any[], arr2: any[]) {
  return equals(new Set(arr1), new Set(arr2))
}

export function compareValues(
  key,
  order = ORDER_TYPE.ASC,
  isDate = false,
) {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    let varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    let varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    if (isDate) {
      varA = moment(varA).valueOf();
      varB = moment(varB).valueOf();
    }

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === ORDER_TYPE.DESC ? comparison * -1 : comparison;
  };
}

export function mergeAndReplace(
  oldArray = [],
  newArray,
  key = 'id',
  sortId,
  sortOrder,
  isDate = false,
) {
  const mergeArray = [...oldArray];
  newArray.forEach(newItem => {
    const index = mergeArray.findIndex(
      oldItem => oldItem[key] === newItem[key],
    );
    if (index >= 0) {
      mergeArray.splice(index, 1, newItem);
    } else {
      if (sortId) {
        if (mergeArray.length > 1) {
          if (
            mergeArray[0][sortId] < mergeArray[mergeArray.length - 1][sortId]
          ) {
            if (newItem[sortId] < mergeArray[0][sortId]) {
              mergeArray.unshift(newItem);
            } else {
              mergeArray.push(newItem);
            }
          } else {
            if (newItem[sortId] < mergeArray[0][sortId]) {
              mergeArray.push(newItem);
            } else {
              mergeArray.unshift(newItem);
            }
          }
        } else {
          mergeArray.push(newItem);
        }
      } else {
        if (mergeArray.length > 1) {
          if (mergeArray[0][key] < mergeArray[mergeArray.length - 1][key]) {
            if (newItem[key] < mergeArray[0][key]) {
              mergeArray.unshift(newItem);
            } else {
              mergeArray.push(newItem);
            }
          } else {
            if (newItem[key] < mergeArray[0][key]) {
              mergeArray.push(newItem);
            } else {
              mergeArray.unshift(newItem);
            }
          }
        } else {
          mergeArray.push(newItem);
        }
      }
    }
  });
  if (sortOrder && sortId) {
    mergeArray.sort(compareValues(sortId, sortOrder, isDate));
  }
  return mergeArray;
}