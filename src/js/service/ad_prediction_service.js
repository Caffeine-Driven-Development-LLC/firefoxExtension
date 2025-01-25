import word_index from '../../../model/word_index.json'
import * as tf from '@tensorflow/tfjs'
import {
    saveJobAdMetadata,
    selectJobAdMetadata,
} from '../dao/index_db_client.js'
import linkedInPreprocessor from './payloadPreprocessors/linkedInPreprocessor.js'
import glassdoorPreprocessor from './payloadPreprocessors/glassdoorPreprocessor.js'

const model = await tf.loadLayersModel(
    browser.extension.getURL('model/model.json')
)

const preProcessFunctions = new Map([
    ['www.linkedin.com', linkedInPreprocessor],
    ['www.glassdoor.com/', glassdoorPreprocessor],
])

const sanitizeData = (text) => {
    return (
        text
            ?.replace(/([A-Z])/g, ' $1')
            .replace(/[^A-Za-z0-9]+/g, ' ')
            .replace(/ +/g, ' ')
            .toLowerCase() || ''
    )
}

const stripUrlToPath = (url) => {
    const i = url?.split('/').slice(3).join(' ') || ''
    const k = i.split('?')[0]
    return sanitizeData(k)
}

const vectorized = (text) => {
    const words = text.split(' ')
    const vector = Array(Object.keys(word_index).length).fill(0)
    words.forEach((word) => {
        // if the word can parse to an integer
        if (parseInt(word)) {
            vector[word_index['[NUM]']] = 1
        }
        if (word_index[word]) {
            vector[word_index[word]] = 1
        } else {
            vector[word_index['[UKN]']] = 1
        }
    })
    return vector
}

function mapToTensors(aTags) {
    const perModel = aTags.map((tag) => ({
        text: sanitizeData(tag.innerText),
        url: stripUrlToPath(tag.href),
    }))

    if (perModel.length === 0) {
        throw new Error('No tags to predict')
    }

    const vectorizedInnerText = perModel.map((tag) => vectorized(tag.text))
    const vectorizedUrl = perModel.map((tag) => vectorized(tag.url))

    const tensorShape = [
        vectorizedInnerText.length,
        Object.keys(word_index).length,
    ]
    const innerTextTensor = tf.tensor2d(vectorizedInnerText, tensorShape)
    const urlTensor = tf.tensor2d(vectorizedUrl, tensorShape)

    return [innerTextTensor, urlTensor]
}

function preprocessPayload(payload) {
    const url = payload.referringUrl
    const hostname = new URL(url).hostname
    const preprocessor = preProcessFunctions.get(hostname)
    if (preprocessor) {
        preprocessor(payload)
    }
}

async function hydrateJobAdMetadata(predictions, payload) {
    preprocessPayload(payload)

    return predictions.map(async (predictedToBeJobAd, index) => {
        const href = payload.anchorTags[index].href

        if (predictedToBeJobAd) {
            let jobAdMetadata = await selectJobAdMetadata(href)
            if (!jobAdMetadata) {
                jobAdMetadata = {
                    firstSeen: new Date().getTime(),
                    referringUrl: payload.referringUrl,
                }
                await saveJobAdMetadata(href, jobAdMetadata)
            }
            return {
                href: href,
                isJobAd: true,
                jobAdMetadata: jobAdMetadata,
            }
        } else {
            return {
                href: href,
                isJobAd: false,
            }
        }
    })
}

export async function makePrediction(payload) {
    const aTags = payload.anchorTags

    return new Promise((resolve, reject) => {
        if (aTags.length === 0) {
            reject('No tags to predict')
        }
        const inputTensors = mapToTensors(aTags)

        const predictions = model
            .predict(inputTensors)
            .arraySync()
            .map((prediction) => prediction[0] > 0.5)

        hydrateJobAdMetadata(predictions, payload).then((predictions) => {
            resolve(Promise.all(predictions))
        })
    })
}
