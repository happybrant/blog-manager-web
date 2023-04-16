export function getTypeList() {
  var array = [
    { 'code': 1, 'name': '工作' },
    { 'code': 2, 'name': '个人' }
  ]

  return array
}

export function getTypeName(type) {
  var array = getTypeList()

  for (var i = 0; i < array.length; i++) {
    if (array[i].code === type) {
      return array[i].name
    }
  }

  return ''
}

export function getTypeCode(name) {
  var array = getTypeList()

  for (var i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      return array[i].code
    }
  }

  return ''
}

export function getLevelList() {
  var array = [
    { 'code': 1, 'name': '紧急' },
    { 'code': 2, 'name': '平级' },
    { 'code': 3, 'name': '一般' }
  ]

  return array
}

export function getLevelName(type) {
  var array = getLevelList()

  for (var i = 0; i < array.length; i++) {
    if (array[i].code === type) {
      return array[i].name
    }
  }

  return ''
}

export function getLevelCode(name) {
  var array = getLevelList()

  for (var i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      return array[i].code
    }
  }

  return ''
}
