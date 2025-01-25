import { createRoot } from 'react-dom/client';
import BookmarkedAdsList from './component/bookmarkedAdsList.js'
import RunItButton from './component/run_it_button.js'

document.body.innerHTML = '<div id="app"></div>';
const root = createRoot(document.getElementById('app'))
root.render(<div>
    <RunItButton />
    <BookmarkedAdsList />
</div>)