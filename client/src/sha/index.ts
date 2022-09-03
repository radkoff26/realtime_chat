import sha from 'sha.js'

export default function encode(s: string) {
    return sha('sha256').update(s).digest('hex')
}