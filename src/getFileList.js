import _ from 'lodash';

function createBaseProps(obj) {
  return {
    fileName: _.last(obj.Key.split("/")),
  }
}

export default function getFileList(list) {
  return list.filter(e => !e.Key.endsWith("/"))
             .filter(e => !e.Key.endsWith("/index.html"))
             .map(createBaseProps)
}
