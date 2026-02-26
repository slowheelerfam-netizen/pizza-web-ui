import PizzaMenu from './PizzaMenu';

export default function Hero({ createOrderAction, checkCustomerWarningAction }) {
  return (
    <div className="relative text-black text-center">
      <div className="pt-24 p-8">
        <PizzaMenu createOrderAction={createOrderAction} checkCustomerWarningAction={checkCustomerWarningAction} />
      </div>
    </div>
  );
}