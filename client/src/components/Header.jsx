import SideImage from './SideImage';

export default function Header() {
    return (
        <header className = "Header">
            <h1>Dylan's Epic Habit Tracker</h1>
            <SideImage src={'/menacing-cat.gif'}/>
        </header>
        
    );
}