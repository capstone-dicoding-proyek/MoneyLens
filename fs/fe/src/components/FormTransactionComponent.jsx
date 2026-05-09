export default function FormTransactionComponent({ items, handleChangeNameTransaction, handleChangeValue, handleDelete, handleChangeQty }) {
  return (
    <div>
      {items.map((item) =>
        (
          <div key={item.id}>
            <input
              type="text"
              placeholder={item.placeholder}
              value={item.name}
              onChange={(e) => handleChangeNameTransaction(item.id, e.target.value)}
            />
            <input
              type="text"
              placeholder='Value...'
              value={item.unitPrice}
              onChange={(e) => handleChangeValue(item.id, e.target.value)}
            />
            { item.type === 'product' && (<input
              type="text"
              placeholder='Value...'
              value={item.qty}
              onChange={(e) => handleChangeQty(item.id, e.target.value)}
            />)}
            <button type="button" onClick={() => handleDelete(item.id)}>-</button>
          </div>
        )
      )}

    </div>
  );
}