export default function removeDuplicateExtensions(arr: any[]) {
  const uniqueList: any[] = [];

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];

    const isExist = uniqueList.find(
      item =>
        item.extensionProductId === current.extensionProductId ||
        item.extensionTitle === current.extensionTitle
    );

    if (!isExist) uniqueList.push(current);
  }

  return uniqueList;
}
