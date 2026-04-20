import { generateFortyTwoAuthorizationUrl } from '@/rest/fortytwo';
import './page.css';
import Image from 'next/image';

export default function Home() {
	return (
		<div className="main">
			<div className="login">
				<Image src="/login/eyes_icon.svg" alt="eyes icon" width={73} height={70} />

				<div>
					<h1>CONNEXION</h1>
					<p>Pour accéder à tes services connecte toi avec 42.</p>
				</div>

				<div className="login-btn">
					<div>
						<a className="login-42" href={generateFortyTwoAuthorizationUrl()}>
							<Image src="/login/42.png" alt="logo 42" width={28} height={15}></Image>
							<p>Continuer avec 42</p>
						</a>
					</div>
					<div className="other-btn">
						<a href="/login/agents/">
							<p>Vous êtes un agents extérieur ?</p>
						</a>
					</div>
				</div>
			</div>
			<div className="image-container">
				<Image src="/login/bg.png" alt="the image background" className="img-bg" width={640} height={832} />
			</div>
		</div>
	);
}
