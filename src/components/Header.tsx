import Logo from './Logo';

const Header = () => {
  return (
    <header className="py-4 px-6 bg-card border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        {/* Future navigation links can go here */}
      </div>
    </header>
  );
};

export default Header;
