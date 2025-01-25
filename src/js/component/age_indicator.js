import { Tooltip, Box } from '@mui/material'

export default function ({ firstSeenTimestamp }) {
    function getFillColor(age) {
        if (age < 1000 * 60 * 60 * 8) {
            return '#2D921D' // Green for less than 8 hours
        } else if (age < 1000 * 60 * 60 * 24 * 7) {
            return '#ffe800' // Yellow for less than 7 days
        } else {
            return '#FF0000' // Red for 7 days or more
        }
    }

    const currentTime = new Date().getTime()
    const ageInMilliseconds = currentTime - firstSeenTimestamp

    const fill = getFillColor(ageInMilliseconds)

    const daysAgo = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24))
    const humanReadableDate = new Date(firstSeenTimestamp).toLocaleDateString()
    const daysAgoText =
        daysAgo < 1
            ? `first seen today\n${humanReadableDate}`
            : `first seen ${daysAgo} days ago\n${humanReadableDate}`

    return (
        <Tooltip title={daysAgoText}>
            <Box sx={{
                width: 7,
                bgcolor: fill,
                borderRadius: 3,
            }} />
        </Tooltip>
    )
}
