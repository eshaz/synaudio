CORRELATE_SRC="src/correlate.c"
CORRELATE_BUILD="src/correlate.wasm"

#		-msimd128 \
#		-DWASM_SIMD=0 \

# requires: llvm, clang, llc, binaryen
correlate:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-flto \
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