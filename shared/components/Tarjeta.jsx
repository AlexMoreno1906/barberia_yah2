// combos de colores armados a mano para que Tailwind los encuentre
const estilosColor = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  cyan: "bg-cyan-100 text-cyan-600",
  pink: "bg-pink-100 text-pink-600",
  amber: "bg-amber-100 text-amber-600",
};

function Tarjeta({ titulo, valor, color = "blue" }) {
  const estilo = estilosColor[color] || estilosColor.blue;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${estilo}`}
      >
        {titulo.charAt(0)}
      </div>
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className="text-xl font-bold text-gray-800">{valor}</p>
      </div>
    </div>
  );
}

export default Tarjeta;
