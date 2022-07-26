export async function getBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() || '')
    reader.onerror = error => reject(error)
  })
}

export function isEqual(object1: { [key: string]: any }, object2: { [key: string]: any }) {
  if (object1 === object2) {
    return true
  }

  if (object1 == null || typeof object1 != 'object' || object2 == null || typeof object2 != 'object') {
    return false
  }

  let propsInObject1 = 0
  let propsInObject2 = 0

  for (const key in object1) {
    propsInObject1 += 1
  }

  for (const key in object2) {
    propsInObject2 += 1

    if (!(key in object1) || !isEqual(object1[key], object2[key])) {
      return false
    }
  }

  return propsInObject1 == propsInObject2
}

export function isEmptyProperty(object: { [key: string]: any }) {
  let isEmpty = false
  const handledFlag = 'temp__isAlreadyHandled__'

  getProperty({ object })

  function getProperty(options: { object: { [key: string]: any }; stack?: any }) {
    const { object, stack } = options

    let propertyPath

    for (const key in object) {
      if (isEmpty) break

      if (typeof object[key] === 'object' && object[key] !== null) {
        if (!object[key][handledFlag]) {
          Object.defineProperty(object[key], handledFlag, {
            value: true,
            writable: false,
            configurable: true
          })

          if (!stack) {
            propertyPath = 'rootObject.' + key
          } else {
            propertyPath = stack + '.' + key
          }

          getProperty({ object: object[key], stack: propertyPath })
        } else {
          propertyPath = stack + '.' + key
          console.error('Сyclic link. Property:', propertyPath)
        }

        delete object[key][handledFlag]
      } else if (object[key] === null || object[key].trim === '') {
        isEmpty = true
      }
    }
  }

  return isEmpty
}

export function move(currentArray: any[], from: number, to: number): any[] {
  if (from < 0 || to < 0 || from >= currentArray.length || to >= currentArray.length || from === to) {
    return currentArray
  }

  const array = [...currentArray]

  const target = array[from]
  const increment = to < from ? -1 : 1

  for (let i = from; i !== to; i += increment) {
    array[i] = array[i + increment]
  }

  array[to] = target

  return array
}
