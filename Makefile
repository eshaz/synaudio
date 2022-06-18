CORRELATE_SRC="src/correlate.c"
CORRELATE_BUILD="src/correlate.wasm"

#		-msimd128 \
#		-ffast-math \
#		-ffinite-loops \
#		-matomics \
#		-mbulk-memory \
#		-mmultivalue \
#		-mmutable-globals \
#		-mnontrapping-fptoint \
#		-mreference-types \
#		-msign-ext \

# ----------------------
# puff (inflate library)
# ----------------------
# requires: llvm, clang, llc, binaryen
correlate:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-flto \
		-msimd128 \
		-DWASM_SIMD=1 \
		-Wl,--import-memory \
		-Wl,--export=correlate \
		-Wl,--export=__heap_base \
		-Wl,--no-entry \
		-Wl,--lto-O3 \
		-O3 \
		-o "$(CORRELATE_BUILD)" \
		$(CORRELATE_SRC)
	@ wasm-opt \
		-lmu \
		-O3 \
		--reorder-functions \
		--reorder-locals \
		--strip-producers \
		--vacuum \
		--converge \
		$(CORRELATE_BUILD) \
		-o $(CORRELATE_BUILD)