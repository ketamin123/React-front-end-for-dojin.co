import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'

const djnPublicKey = new Uint8Array([196,129,52,112,135,76,154,180,164,29,43,182,26,19,230,156,70,157,148,41,192,134,191,46,102,138,218,19,253,0,240,76])

const newDjnSignature = (secretKey) => {
  const decodedKey = new Uint8Array(secretKey.split(',').map((i) => Number(i)))

  const date = (Date.now() + (1000 * 60 * 60 * 24 * 30)).toString()

  const message = nacl.sign(
    naclutil.decodeUTF8(date),
    decodedKey
  )

  return naclutil.encodeBase64(message)
}

const verifyDjnSignature = (encodedMessage) => {
  try {
    const decodedMessage = naclutil.decodeBase64(encodedMessage)
    const message = nacl.sign.open(decodedMessage, djnPublicKey)

    if (message) {
      return validDate(
        naclutil.encodeUTF8(message)
      )
    } else {
      return false
    }
  } catch {
    return false
  }
}

const validDate = (date) => {
  const comparedDate = Number(date)
  const currentDate = Date.now()

  return currentDate < comparedDate
}

export {
  newDjnSignature,
  verifyDjnSignature,
}
