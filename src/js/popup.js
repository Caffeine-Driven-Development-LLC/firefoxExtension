import { createRoot } from 'react-dom/client';
import BookmarkedAdsList from './component/bookmarkedAdsList.js'
import RunItButton from './component/run_it_button.js'
import Add_delete_known_url_button from './component/add_delete_known_url_button.js'
import ListKnownUrls from './component/list_known_urls.js'

document.body.innerHTML = '<div id="app"></div>';
const root = createRoot(document.getElementById('app'))
root.render(<div>
    <RunItButton />
    <Add_delete_known_url_button />
    <BookmarkedAdsList />
    <ListKnownUrls />
</div>)