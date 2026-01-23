import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { PACIENTE_BUSQUEDA } from "../../redux/types";

function Search(props) {

  const state = useSelector((state) => state.paciente);
  const dispatch = useDispatch();

  const onChange = (e) => {
    const texto = e.target.value.toLowerCase().trim();
    dispatch( {type: PACIENTE_BUSQUEDA, payload: texto.toString()} );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 py-3">
          <div className="card shadow-sm border border-dark">
            <div className="card-body">
              <div className="input-group mb-1">
                <div className="input-group-prepend">
                  <div className="input-group-text bg-white border-0">
                    <FontAwesomeIcon icon={faSearch} />
                  </div>
                </div>
                <input
                  className="form-control form-control-search"
                  type="search"
                  placeholder="Buscar pacientes..."
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
