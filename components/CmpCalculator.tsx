"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Ligne {
  volume: string;
  prix: string;
}

interface Resultats {
  lignes: Array<{
    volume: number;
    prix: number;
    mb: number;
    f: number;
    mn: number;
  }>;
  volumeTotal: number;
  montantTotal: number;
  cmpFinal: number;
  sommeMN: number;
  sommeVolume: number;
}

interface State {
  tauxFrais: string;
  lignes: Ligne[];
  volumeInitial: string;
  cmpInitial: string;
  resultats: Resultats | null;
}

const CMPCalculator: React.FC = () => {
  const initialState: State = {
    tauxFrais: "",
    lignes: [{ volume: "", prix: "" }],
    volumeInitial: "",
    cmpInitial: "",
    resultats: null,
  };

  const [state, setState] = useState<State>(initialState);

  const resetForm = () => {
    setState(initialState);
  };

  const ajouterLigne = () => {
    setState((prevState) => ({
      ...prevState,
      lignes: [...prevState.lignes, { volume: "", prix: "" }],
    }));
  };

  const retirerLigne = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      lignes: prevState.lignes.filter((_, i) => i !== index),
    }));
  };

  const mettreAJourLigne = (index: number, champ: keyof Ligne, valeur: string) => {
    const nouvellesLignes = [...state.lignes];
    nouvellesLignes[index][champ] = valeur;
    setState((prevState) => ({
      ...prevState,
      lignes: nouvellesLignes,
    }));
  };

  const validerFormulaire = () => {
    if (
      state.tauxFrais === "" ||
      state.volumeInitial === "" ||
      state.cmpInitial === ""
    ) {
      alert("Veuillez remplir tous les champs du formulaire principal.");
      return false;
    }
    if (state.lignes.length === 0) {
      alert("Veuillez ajouter au moins une ligne.");
      return false;
    }
    for (const ligne of state.lignes) {
      if (ligne.volume === "" || ligne.prix === "") {
        alert("Veuillez remplir tous les champs de chaque ligne.");
        return false;
      }
    }
    return true;
  };

  const calculerCMP = () => {
    if (!validerFormulaire()) return;

    const resultatsLignes = state.lignes.map((ligne) => {
      const volume = parseFloat(ligne.volume);
      const prix = parseFloat(ligne.prix);
      const mb = volume * prix;
      const f = mb * (parseFloat(state.tauxFrais) / 100);
      const mn = mb + f;
      return { volume, prix, mb, f, mn };
    });

    const sommeMN = resultatsLignes.reduce((sum, ligne) => sum + ligne.mn, 0);
    const sommeVolume = resultatsLignes.reduce(
      (sum, ligne) => sum + ligne.volume,
      0
    );
    const mnInitial =
      parseFloat(state.volumeInitial) * parseFloat(state.cmpInitial);

    const montantTotal = sommeMN + mnInitial;
    const volumeTotal = sommeVolume + parseFloat(state.volumeInitial);
    const cmpFinal = montantTotal / volumeTotal;

    setState((prevState) => ({
      ...prevState,
      resultats: {
        lignes: resultatsLignes,
        volumeTotal,
        montantTotal,
        cmpFinal,
        sommeMN,
        sommeVolume,
      },
    }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Calculateur de Coût Moyen Pondéré (CMP)
      </h1>

      <div className="mb-4">
        <label className="block mb-2">Taux de frais (%)</label>
        <Input
          type="number"
          value={state.tauxFrais}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              tauxFrais: e.target.value,
            }))
          }
          className="w-full"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Volume initial</label>
        <Input
          type="number"
          value={state.volumeInitial}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              volumeInitial: e.target.value,
            }))
          }
          className="w-full"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">CMP initial</label>
        <Input
          type="number"
          value={state.cmpInitial}
          onChange={(e) =>
            setState((prevState) => ({
              ...prevState,
              cmpInitial: e.target.value,
            }))
          }
          className="w-full"
          min="0"
          step="0.01"
          required
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Lignes</h2>
      {state.lignes.map((ligne, index) => (
        <div key={index} className="flex mb-2 space-x-2">
          <Input
            type="number"
            placeholder="Volume"
            value={ligne.volume}
            onChange={(e) => mettreAJourLigne(index, "volume", e.target.value)}
            className="w-1/3"
            min="0"
            step="0.01"
            required
          />
          <Input
            type="number"
            placeholder="Prix"
            value={ligne.prix}
            onChange={(e) => mettreAJourLigne(index, "prix", e.target.value)}
            className="w-1/3"
            min="0"
            step="0.01"
            required
          />
          <Button
            onClick={() => retirerLigne(index)}
            className="w-1/3"
            disabled={state.lignes.length === 1}
          >
            Retirer
          </Button>
        </div>
      ))}

      <div className="flex space-x-2 mb-4">
        <Button onClick={ajouterLigne} className="flex-1">
          Ajouter une ligne
        </Button>
        <Button
          onClick={resetForm}
          className="flex-1 bg-red-700 hover:bg-red-500"
        >
          Réinitialiser
        </Button>
      </div>
      <Button onClick={calculerCMP} className="block w-full mt-10 !bg-blue-700">
        Calculer CMP
      </Button>

      {state.resultats && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Résultats</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Volume</th>
                <th className="border p-2">Prix d&apos;achat</th>
                <th className="border p-2">Montant Brut</th>
                <th className="border p-2">Frais</th>
                <th className="border p-2">Montant Net</th>
              </tr>
            </thead>
            <tbody>
              {state.resultats.lignes.map((ligne, index) => (
                <tr key={index}>
                  <td className="border p-2">{ligne.volume.toFixed(2)}</td>
                  <td className="border p-2">{ligne.prix.toFixed(2)}</td>
                  <td className="border p-2">{ligne.mb.toFixed(2)}</td>
                  <td className="border p-2">{ligne.f.toFixed(2)}</td>
                  <td className="border p-2">{ligne.mn.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col gap-2">
            <div>
              <strong>Volume Total:</strong>{" "}
              {state.resultats.volumeTotal.toFixed(2)}
            </div>
            <div>
              <strong>Montant Total:</strong>{" "}
              {state.resultats.montantTotal.toFixed(2)}
            </div>
            <div>
              <strong>CMP Final:</strong> {state.resultats.cmpFinal.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMPCalculator;
