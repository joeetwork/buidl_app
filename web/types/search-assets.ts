export interface Assets {
	result: {
		total: number;
		limit: number;
		page: number;
		items: Item[];
	};
}

export interface Item {
	interface: string;
	id: string;
	content: Content;
	authorities: Authority[];
	compression: Compression;
	grouping: Grouping[];
	royalty: Royalty;
	creators: Creator[];
	ownership: Ownership;
	supply?: Supply;
	mutable: boolean;
	burnt: boolean;
	uses?: Uses;
}

export interface Content {
	$schema: string;
	json_uri: string;
	files: File[];
	metadata: Metadata;
	links: Links;
}

export interface File {
	uri: string;
	cdn_uri?: string;
	mime: string;
}

export interface Metadata {
	attributes?: Attribute[];
	description?: string;
	name: string;
	symbol: string;
	token_standard?: string;
}

export interface Attribute {
	value: string;
	trait_type: string;
}

export interface Links {
	image?: string;
	animation_url?: string;
	external_url?: string;
}

export interface Authority {
	address: string;
	scopes: string[];
}

export interface Compression {
	eligible: boolean;
	compressed: boolean;
	data_hash: string;
	creator_hash: string;
	asset_hash: string;
	tree: string;
	seq: number;
	leaf_id: number;
}

export interface Grouping {
	group_key: string;
	group_value: string;
}

export interface Royalty {
	royalty_model: string;
	target: null;
	percent: number;
	basis_points: number;
	primary_sale_happened: boolean;
	locked: boolean;
}

export interface Creator {
	address: string;
	share: number;
	verified: boolean;
}

export interface Ownership {
	frozen: boolean;
	delegated: boolean;
	delegate: null;
	ownership_model: string;
	owner: string;
}

export interface Supply {
	print_max_supply: number;
	print_current_supply: number;
	edition_nonce: number;
}

export interface Uses {
	use_method: string;
	remaining: number;
	total: number;
}

export interface AssetParams {
    ownerAddress: string,
    compressed: boolean,
    page: number,
    limit: number,
}