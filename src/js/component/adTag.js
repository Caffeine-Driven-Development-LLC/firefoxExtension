import Age_indicator from './age_indicator.js'
import { Box, Stack } from '@mui/material'

export default function AdTag({ aTag, metadata }) {
    return (
        <Box sx={{ height: '100%' }}>
            <Stack direction="row" sx={{ height: '100%' }}>
                <Age_indicator firstSeenTimestamp={metadata.firstSeen} />
            </Stack>
        </Box>
    )
}
