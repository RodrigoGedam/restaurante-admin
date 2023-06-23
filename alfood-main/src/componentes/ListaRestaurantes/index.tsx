import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

const ListaRestaurantes = () => {
	const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
	const [proxPagina, setProxPagina] = useState('');

	useEffect(() => {
		axios
			.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
			.then((resposta) => {
				setRestaurantes(resposta.data.results);
				setProxPagina(resposta.data.next);
			})
			.catch((erro) => {
				console.log(erro);
			});
	}, []);

	const verMais = () => {
		axios
			.get<IPaginacao<IRestaurante>>(proxPagina)
			.then((resposta) => {
				setRestaurantes([...restaurantes, ...resposta.data.results]);
				setProxPagina(resposta.data.next);
			})
			.catch((erro) => {
				console.log(erro);
			});
	};

	return (
		<section className={style.ListaRestaurantes}>
			<h1>
				Os restaurantes mais <em>bacanas</em>!
			</h1>
			{restaurantes?.map((item) => (
				<Restaurante restaurante={item} key={item.id} />
			))}
			{proxPagina && <button onClick={verMais}>Ver mais</button>}
		</section>
	);
};

export default ListaRestaurantes;
