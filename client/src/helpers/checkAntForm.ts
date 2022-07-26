import { FormInstance } from 'antd'

import { isEmptyProperty, isEqual } from 'utils/services'
import { format } from 'utils/format'

interface FormFieldsChangeOptions {
  initialValues: { [key: string]: any }
  setEdit: (value: boolean) => void
  isEmpty?: boolean
}

function checkAntForm(form: FormInstance, options: FormFieldsChangeOptions) {
  const { initialValues, setEdit, isEmpty = false } = options

  const fieldsValue = form.getFieldsValue()

  for (const field in fieldsValue) {
    if (fieldsValue[field]?.constructor?.name === 'Moment') {
      fieldsValue[field] = fieldsValue[field] ? fieldsValue[field].format(format.date) : fieldsValue[field]
    }
    if (initialValues[field]?.constructor?.name === 'Moment') {
      initialValues[field] = initialValues[field] ? initialValues[field].format(format.date) : initialValues[field]
    }

    if (!fieldsValue[field]) {
      fieldsValue[field] = null
    }
    if (fieldsValue[field] instanceof Array && fieldsValue[field].length === 0) {
      fieldsValue[field] = null
    }
    if (initialValues[field] instanceof Array && initialValues[field].length === 0) {
      initialValues[field] = null
    }
  }

  const formContainsErrors = form.getFieldsError().some(field => field.errors.length !== 0)
  const equality = isEqual(initialValues, fieldsValue)
  const empty = isEmptyProperty(fieldsValue)

  if (equality || formContainsErrors) {
    if (isEmpty && empty) {
      setEdit(false)
      return { fieldsValue }
    }

    setEdit(false)
    return { fieldsValue }
  }
  if (!equality && !formContainsErrors) {
    if (isEmpty && empty) {
      setEdit(false)
      return { fieldsValue }
    }

    setEdit(true)
    return { fieldsValue }
  }

  return { fieldsValue }
}

export default checkAntForm