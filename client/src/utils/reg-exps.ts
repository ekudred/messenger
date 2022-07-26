export const RegExpPassword = /^.{8,32}$/
export const RegExpUserName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,15}$/
export const RegExpFullName = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
export const RegExpPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,5}$/im
// ^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$ Russian phone numbers
export const RegExpFolderName = /^.{4,16}$/
export const RegExpGroupName = /^.{2,32}$/