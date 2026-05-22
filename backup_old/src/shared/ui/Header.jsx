import { useGameStore } from '../store/useGameStore';

const Header = () => {
  const { fish, paw, addCurrency } = useGameStore();
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '18px 20px 0', background: 'transparent', flexShrink: 0
    }}>
      <span style={{
        fontSize: '26px', fontWeight: 900, color: '#3E3127',
        letterSpacing: '-1px', fontFamily: "'Outfit', sans-serif"
      }}>
        BINGLE
      </span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => addCurrency('fish', 10)}
          style={{
            background: 'white', border: '2px solid #D4B896', borderRadius: '20px',
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '5px',
            fontWeight: 800, fontSize: '14px', color: '#3E3127', cursor: 'pointer',
            boxShadow: '0 2px 0 rgba(62,49,39,0.1)'
          }}
        >
          🐟 {fish.toLocaleString()} <span style={{ color: '#B08060', fontWeight: 600, marginLeft: 2 }}>+</span>
        </button>
        <button
          onClick={() => addCurrency('paw', 10)}
          style={{
            background: 'white', border: '2px solid #D4B896', borderRadius: '20px',
            padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '5px',
            fontWeight: 800, fontSize: '14px', color: '#3E3127', cursor: 'pointer',
            boxShadow: '0 2px 0 rgba(62,49,39,0.1)'
          }}
        >
          🍪 {paw.toLocaleString()} <span style={{ color: '#B08060', fontWeight: 600, marginLeft: 2 }}>+</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
