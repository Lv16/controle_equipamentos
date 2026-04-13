interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header style={{
          backgroundColor: '#0d4c94',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
      <h1>{title}</h1>
        </header>
    );
};

export default Header;