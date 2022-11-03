import { BrowserHistory, createBrowserHistory } from 'history';

// Function to route from redux to other viable routes using history
const history: BrowserHistory | any = createBrowserHistory();

export default history;
