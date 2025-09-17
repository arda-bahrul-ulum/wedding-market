import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { formatCurrency } from "../../utils/format";

function CartSidebar({ isOpen, onClose }) {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleRemoveItem = (id, type) => {
    removeItem(id, type);
  };

  const handleUpdateQuantity = (id, type, quantity) => {
    updateQuantity(id, type, quantity);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Keranjang Belanja
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {items.length === 0 ? (
                            <div className="text-center py-12">
                              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-2 text-sm font-medium text-gray-900">
                                Keranjang kosong
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Mulai tambahkan item ke keranjang Anda
                              </p>
                              <div className="mt-6">
                                <Button
                                  onClick={() => {
                                    onClose();
                                    navigate("/marketplace");
                                  }}
                                >
                                  Jelajahi Marketplace
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {items.map((item) => (
                                <li
                                  key={`${item.id}-${item.type}`}
                                  className="flex py-6"
                                >
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={
                                        item.image || "/api/placeholder/100/100"
                                      }
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a
                                            href="#"
                                            className="hover:text-primary-600"
                                          >
                                            {item.name}
                                          </a>
                                        </h3>
                                        <p className="ml-4">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {item.vendor_name}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.id,
                                              item.type,
                                              item.quantity - 1
                                            )
                                          }
                                          className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                          <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="px-2 py-1 border border-gray-300 rounded text-center min-w-[2rem]">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.id,
                                              item.type,
                                              item.quantity + 1
                                            )
                                          }
                                          className="p-1 rounded-full hover:bg-gray-100"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-red-600 hover:text-red-500"
                                          onClick={() =>
                                            handleRemoveItem(item.id, item.type)
                                          }
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <p>Subtotal</p>
                          <p>{formatCurrency(total)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6 space-y-3">
                          <Button onClick={handleCheckout} className="w-full">
                            Checkout
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              onClose();
                              navigate("/marketplace");
                            }}
                            className="w-full"
                          >
                            Lanjutkan Belanja
                          </Button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <button
                            onClick={clearCart}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Kosongkan Keranjang
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CartSidebar;

