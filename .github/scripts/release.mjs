const release = async ({ releases, core, context, github }) => {
	const { name, version } = releases[0];

	const { info } = core;
	const { owner, repo } = context.repo;

	const tag = `v${version}`;

	info(`get release for tag: ${tag}`);

	const {
		data: { id, prerelease, ...data },
	} = await github.rest.repos.getReleaseByTag({
		owner,
		repo,
		tag,
	});

	return { id, name, version, tag, prerelease, data };
};

const ref = async ({ github, context, tag, core }) => {
	const { info } = core;
	const { owner, repo } = context.repo;

	const {
		data: {
			object: { sha },
		},
	} = await github.rest.git.getRef({
		owner,
		repo,
		ref: `tags/${tag}`,
	});

	info(`resolved tag ${tag} → ${sha}`);

	return sha;
};

export const alias = async (releases, { core, context, github }) => {
	const { id, version, tag } = await release({
		releases,
		core,
		context,
		github,
	});

	const { info, warning, setOutput } = core;
	const { owner, repo } = context.repo;

	const [major, minor] = version.split(".");

	const aliases = [`v${major}`, `v${major}.${minor}`];

	const sha = await ref({ github, context, tag, core });

	for (const alias of aliases) {
		try {
			info(`updating alias tag: ${alias}`);

			await github.rest.git.updateRef({
				owner,
				repo,
				ref: `tags/${alias}`,
				sha,
				force: true,
			});

			info(`updated tag ${alias} → ${sha}`);
		} catch (err) {
			if (err.status === 404) {
				await github.rest.git.createRef({
					owner,
					repo,
					ref: `refs/tags/${alias}`,
					sha,
				});

				info(`created alias tag ${alias} → ${sha}`);
			} else {
				warning(`failed to create/update alias tag ${alias}: ${err.message}`);
			}
		}
	}

	info(`set outputs`);

	info(`  id: "${id}"`);
	setOutput(`id`, id);

	info(`  version: "${version}"`);
	setOutput(`version`, version);

	info(`  tag: "${tag}"`);
	setOutput(`tag`, tag);

	info(`  aliases: "${JSON.stringify(aliases)}"`);
	setOutput(`aliases`, JSON.stringify(aliases));

	info(`  major: "${major}"`);
	setOutput(`major`, major);

	info(`  minor: "${minor}"`);
	setOutput(`minor`, minor);
};

export const run = async (releases, { core, context, github }) => {
	const { setOutput, info } = core;

	const { id, version, tag, prerelease, data } = await release({
		releases,
		core,
		context,
		github,
	});

	// Use to convert to a numbered prerelease for WIX releases
	const toWix = (version) => {
		const [base, pre] = version.split("-");

		const prerelease = {
			alpha: 1000,
			beta: 2000,
			next: 3000,
			rc: 5000,
		};

		if (base && pre) {
			const [label, build] = pre.split(".");

			if (prerelease[label]) {
				const number = parseInt(build || "0", 10);

				return `${base}-${prerelease[label] + number}`;
			}
		}

		return version;
	};

	const wix = toWix(version);
	const semver = wix.replace(/[-+]/g, ".");

	info(`set outputs`);

	info(`  data: ${JSON.stringify({ id, prerelease, ...data })}`);
	setOutput(`data`, JSON.stringify({ id, prerelease, ...data }));

	info(`  id: "${id}"`);
	setOutput(`id`, id);

	info(`  version: "${version}"`);
	setOutput(`version`, version);

	info(`  tag: "${tag}"`);
	setOutput(`tag`, tag);

	info(`  wix: "${wix}"`);
	setOutput(`wix`, wix);

	info(`  semver: "${semver}"`);
	setOutput(`semver`, semver);

	info(`  prerelease: "${prerelease}"`);
	setOutput(`prerelease`, prerelease);
};
