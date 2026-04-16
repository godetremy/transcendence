import './page.css';
import Image from 'next/image';
import eyes from '../../public/login/eyes_icon.svg';
import bg from '../../public/login/bg.png';
import logo from '../../public/login/42.png';

export default function Home() {
	return (
		<div className="main">
			<div className="login">
				<Image src={eyes} alt="eyes icon" />

				<div>
					<h1>CONNEXION</h1>
					<p>Pour accéder à tes services connecte toi avec 42.</p>
				</div>

				<div className="login-btn">
					<div>
						<a className="login-42">
							<Image src={logo} alt="logo 42"></Image>
							<p>Continuer avec 42</p>
						</a>
					</div>
					<div className="other-btn">
						<a>
							<p>Vous êtes un agents extérieur ?</p>
						</a>
					</div>
				</div>
			</div>
			<Image src={bg} alt="the image background" className="img-bg" />
		</div>
	);
}
