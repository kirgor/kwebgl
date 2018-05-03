export function loadFile(uri: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const httpRequest = new XMLHttpRequest()
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(httpRequest.responseText)
                } else {
                    reject(httpRequest)
                }
            }
        }
        httpRequest.open('GET', uri)
        httpRequest.send()
    })
}