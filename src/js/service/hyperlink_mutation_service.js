import { createRoot } from 'react-dom/client'
import AdTag from '../component/adTag.js'

const containerDivId = `job-ad-container`
const metadataDivId = `job-ad-tag`

export function addMetadataToHyperlinks(jobAdHyperlink, metadata) {
    let containerDiv = jobAdHyperlink.parentNode
    if (!containerDiv || containerDiv.id !== containerDivId) {
        containerDiv = createContainerDiv()
        jobAdHyperlink.parentNode.insertBefore(containerDiv, jobAdHyperlink)
        containerDiv.appendChild(jobAdHyperlink)
    }

    let metadataDiv = jobAdHyperlink.previousSibling
    if (!metadataDiv || metadataDiv.id !== metadataDivId) {
        metadataDiv = document.createElement('div')
        metadataDiv.id = metadataDivId
        containerDiv.prepend(metadataDiv)

        const root = createRoot(metadataDiv)
        root.render(<AdTag aTag={jobAdHyperlink} metadata={metadata} />)
    }
}


function createContainerDiv() {
    const containerDiv = document.createElement('div')
    containerDiv.id = containerDivId
    containerDiv.style.display = 'flex'
    containerDiv.style.flexDirection = 'row'
    containerDiv.style.gap = '3px'
    return containerDiv
}